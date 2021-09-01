import type { NextPage } from 'next'
import Map from 'components/map';
import { GetServerSideProps } from 'next'
import { protectPage } from 'helpers/auth';


const Home: NextPage = () => {
  return (
    <div>
      <Map />
    </div>
  )
}

export default Home




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isLogin = protectPage(ctx);
  if (!isLogin) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: {

      }
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: "/user",
    },
    props: {

    }
  }
}
