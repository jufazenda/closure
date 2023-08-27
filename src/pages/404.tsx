import Head from "next/head";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Closure - Organizador de Fechamento</title>
      </Head>
      <div>
        <h1>404</h1>
        <h2>Página não encontrada.</h2>
        <span>
          Acesse a página inicial clicando <Link href={"/"}>aqui</Link>
        </span>
      </div>
    </>
  );
};

export default NotFound;
