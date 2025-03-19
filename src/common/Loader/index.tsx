import useColorMode from '../../hooks/useColorMode';

const Loader = () => {
  const [colorMode] = useColorMode();

  return (
    <div className={`flex h-screen items-center justify-center ${
      colorMode === 'dark' ? 'bg-boxdark-2' : ''
    } text-white`}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
