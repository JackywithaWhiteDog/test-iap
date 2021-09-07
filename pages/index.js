import Head from 'next/head'

import { validateAssertion } from '../utils/auth';

const Home = (props) => {
  console.log(props);
  return (
    <div>
      <Head>
        <title>IAP testing</title>
        <meta name="description" content="test IAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Hello</h2>
      <p>Your email: {props.email}</p>
      <p>Your id: {props.id}</p>
      <hr />
      <p>Verified email: {props.verified_email}</p>
      <p>verified sub: {props.verified_sub}</p>
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  const assertion = req.headers['x-goog-iap-jwt-assertion'];
  
  let verified_email = 'None';
  let verified_sub = 'None';
  let payload;

  try {
    const info = await validateAssertion(assertion);
    payload = info;
    verified_email = info.email ?? 'None';
    verified_sub = info.sub ?? 'None';
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      email: req.headers['x-goog-authenticated-user-email'] ?? 'None',
      id: req.headers['x-goog-authenticated-user-id'] ?? 'None',
      payload: payload,
      verified_email: verified_email,
      verified_sub: verified_sub
    }
  };
}

export default Home
