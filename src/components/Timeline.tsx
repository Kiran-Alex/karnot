import React from "react"

export const TimeLine: React.FC = ({ }) => {
    return (
        <>
            <div className="flex items-center w-fit h-[32px]">

              {/* 1st Node */}
                <div className="flex items-center w-fit h-full">
                    <div className="bg-[#117D49] text-white px-2 pr-4 py-2 rounded-full flex items-center space-x-2 h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[11px]">Received</span>
                    </div>
                </div>

               {/* 2nd Node */}
                <div className="flex items-center w-fit h-[32px]">
                    <div className="h-[2px] bg-[#117D49] w-7"></div>
                    <div className="bg-[#117D49] text-white px-2 pr-4 py-2 rounded-full flex items-center space-x-2 h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[11px]">Accepted on L2</span>
                    </div>

                </div>

              {/* 3rd Node */}
                <div className="flex items-center w-fit h-[32px]">
                    <div className="h-[2px] bg-[#4B4B4B] w-7"></div>
                    <div className="border border-[#4B4B4B] h-full w-8 text-white  rounded-full flex items-center justify-center space-x-2 group hover:w-fit hover:px-1 hover:py-4 hover:pr-5 cursor-pointer">
                    <span className="loading loading-spinner loading-xs w-7 bg-[#4B4B4B]"></span>
                        <div className="flex flex-row space-x-2 hidden group-hover:flex">
                            <span className="text-[11px]">Accepted on L1</span>
                        </div>
                      
                    </div>

                </div>
            </div>
        </>
    )
}