import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative w-full mt-16">
      {/* Charlie Peaking Over Fence - True Edge-to-Edge Full Screen */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        {/* Subtle edge cropping on mobile, maintaining same height proportions */}
        <div className="w-full flex justify-center">
          <div className="relative w-full aspect-[3/1]">
            <Image
              src="/charlie-fence.png"
              alt="Charlie Bull Peeking Over Fence"
              fill
              className="transition-all duration-700 ease-in-out object-cover object-center
                         scale-[1.04] sm:scale-[1.03] md:scale-[1.02] lg:scale-[1.01] xl:scale-100"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Text Content - Below the image with reduced top padding */}
      <div className="w-full flex flex-col items-center pt-3 pb-8 px-4 bg-base-100">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} by Charlie. All rights reserved!
          </p>
        </div>
      </div>
    </footer>
  );
}