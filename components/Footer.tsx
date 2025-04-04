import Image from "next/image";
// import Link from "next/link";

export function Footer() {
  return (
    <div className="bg-base-100 min-h-0 py-10 px-1 lg:mb-0">
      <div className="px-5 mt-10">
        <ul className="flex items-end justify-center space-x-4 lg:space-x-8">
          {/* Twitter Logo */}
          <li className="flex items-end pb-5">
            <a
              href="https://x.com/NFTLadyEve"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-110 hover:-translate-y-1 duration-200"
            >
              <Image src="/TwitterXLogo.png" alt="Twitter Logo" width={75} height={75} className="rounded-lg" />
            </a>
          </li>

          {/* Charlie Bull Image */}
          <li className="flex items-center">
            <Image 
              src="/CharlieBull.png" 
              alt="Charlie Bull Headshot" 
              width={300} 
              height={300} 
              className="rounded-lg"
            />
          </li>

          {/* Telegram Logo */}
          <li className="flex items-end pb-5">
            <a
              href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-110 hover:-translate-y-1 duration-200"
            >
              <Image src="/TelegramLogo.png" alt="Telegram Logo" width={75} height={75} className="rounded-lg" />
            </a>
          </li>
        </ul>
      </div>
      
      {/* Copyright Text */}
      <p className="text-center mt-6 text-sm font-medium text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} by Charlie. All rights reserved!
      </p>
    </div>
  );
}