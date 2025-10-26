import React from 'react';
export class ErrorBoundary extends React.Component<React.PropsWithChildren, {error:any}> {
  state = { error: null as any };
  static getDerivedStateFromError(error:any){ return { error }; }
  componentDidCatch(e:any, info:any){ console.error('ErrorBoundary', e, info); }
  render(){ return this.state.error ? <pre style={{color:'red',padding:16,whiteSpace:'pre-wrap'}}>{String(this.state.error?.message||this.state.error)}</pre> : this.props.children; }
}
