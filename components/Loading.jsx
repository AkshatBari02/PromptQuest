import Image from "next/image";

const Loading = () => {
  return (
    <div className='w-full flex-center'>
      <Image
        src={"/assets/icons/loader.svg"}
        width={150}
        height={150}
        alt='loader'
        className='object-contain flex items-center justify-center'
      />
    </div>
  );
};

export default Loading;