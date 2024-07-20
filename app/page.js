import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>

      <div style={{ backgroundColor: '#f2f2f2' }} className="w-full p-[40px] h-screen flex justify-center items-center">
        <div className="w-auto h-auto">

          <div className="mb-[20px] flex justify-center items-center">
            <Image src="https://takenote.dev/26da41caf83070639053.svg"
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>

          <h1 style={{ color: '#404040' }} className="text-[3rem] text-center"><b>The Note Taking App <br /> for Developers</b></h1>
          <h4 className="text-center text-[1.4rem] m-[1rem] text-slate-500">A web-based notes app for developers.</h4>

          <div style={{ borderRadius: '0.3rem', border: '1px solid #e5e5e5' }} className="w-auto h-auto bg-white px-[3rem] py-[2rem]">
            <p style={{ lineHeight: 2 }} className="text-center">
              TakeNote is only available as a demo. Your notes will be saved to local storage and <b>not</b> <br />persisted in any database or cloud.
            </p>
            <div className="w-full flex justify-center items-center mt-[20px]">
              <Link href='/login'>
                <button type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Use App</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
