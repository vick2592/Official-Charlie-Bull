import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative w-full mt-16">
      {/* Charlie Peaking Over Fence - Full Width Image */}
      <div className="relative w-full">
        {/* On mobile, crop height but less aggressively */}
        <div className="block md:hidden w-full h-52 overflow-hidden">
          <Image
            src="/CharlieOverFence.png" 
            alt="Charlie Bull Peeking Over Fence"
            layout="fill"
            objectFit="cover"
            objectPosition="center 30%"
            priority
          />
        </div>
        
        {/* On desktop, show full width image */}
        <div className="hidden md:block w-full">
          <Image
            src="/CharlieOverFence.png"
            alt="Charlie Bull Peeking Over Fence"
            width={1920}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Social Media Links with responsive positioning */}
      </div>
      
      {/* Text Content - Below the image with reduced top padding */}
      <div className="w-full flex flex-col items-center pt-3 pb-8 px-4 bg-base-100">
        <div className="text-center">
          {/* <p className="text-lg mb-2">Join us in making Charlie the first cross-chain token!</p> */}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} by Charlie. All rights reserved!
          </p>
        </div>
      </div>
    </footer>
  );
}