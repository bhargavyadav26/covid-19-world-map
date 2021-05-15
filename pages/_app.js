import App from 'next/app'
import '../styles/globals.scss';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const isServer = typeof window === 'undefined';
    
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return { pageProps };
      }
    render () {
        const { pageProps, Component } = this.props;
        return <Component {...pageProps} />
    }
  }
  
  export default MyApp