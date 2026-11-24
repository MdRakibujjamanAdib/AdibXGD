import { StrictMode } from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import * as HelmetAsyncModule from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import App from './App.tsx';
import { NavbarProvider } from './context/NavbarContext.tsx';

const HelmetProvider =
  (
    HelmetAsyncModule as unknown as {
      HelmetProvider?: typeof HelmetAsyncModule.HelmetProvider;
      default?: { HelmetProvider?: typeof HelmetAsyncModule.HelmetProvider };
    }
  ).HelmetProvider ??
  (
    HelmetAsyncModule as unknown as {
      default?: { HelmetProvider?: typeof HelmetAsyncModule.HelmetProvider };
    }
  ).default?.HelmetProvider;

export interface ServerRenderResult {
  html: string;
  helmet: HelmetServerState | undefined;
}

async function resolveLazyRoute(url: string, HelmetProviderComponent: typeof HelmetAsyncModule.HelmetProvider): Promise<void> {
  const warmContext: { helmet?: HelmetServerState } = {};
  await new Promise<void>((resolve, reject) => {
    const sink = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    sink.on('finish', resolve);
    sink.on('error', reject);

    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProviderComponent context={warmContext}>
          <StaticRouter location={url}>
            <NavbarProvider>
              <App />
            </NavbarProvider>
          </StaticRouter>
        </HelmetProviderComponent>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError(err) {
          reject(err);
        },
      }
    );
  });
}

export async function render(url: string): Promise<ServerRenderResult> {
  if (!HelmetProvider) {
    throw new Error('Failed to resolve HelmetProvider in SSR environment.');
  }

  // Ensure any React.lazy() route chunk for this URL is resolved before synchronous renderToString
  await resolveLazyRoute(url, HelmetProvider);

  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <NavbarProvider>
            <App />
          </NavbarProvider>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );

  return {
    html,
    helmet: helmetContext.helmet,
  };
}
