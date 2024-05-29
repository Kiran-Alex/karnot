import { useRouter } from "next/router";
import { Labelch } from "~/components/LabelwithChildren";
import { TimeLine } from "~/components/Timeline";
import TxDetailsRow from "~/components/TxDetailsRow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCopyToClipboard } from 'usehooks-ts'
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { TxReceipt } from "~/types";
import { getTxType } from "~/types";
import { useQuery } from "@tanstack/react-query";
import { TimeStamp_MDYT_Converter, HextoDecimalConverter, WeiToEtherConverter, TimeStamp_ago_Converter } from "~/utils/Converter";
import Chip from "~/components/Chip";
export default function Tx() {
  const router = useRouter();
  const { id } = router.query;
  const [BlockData, setBlockData] = useState<getTxType>()
  const [pageStatus, setPageStatus] = useState<boolean>(true)
  const [copiedText, copy] = useCopyToClipboard()


  const handleCopy = async (text: string) => {
    await copy(text)
      .then(() => {
        console.log('Copied!', { text })
        toast.success('Copied to clipboard')
      })
      .catch(error => {
        console.error('Failed to copy!', error)
      })
  }


  const getTxDataByHash = api.transaction.getTransactionByHash.useQuery({
    Tx_hash: id as string
  })

  const getTxReceipt = useQuery({
    queryKey: [id],
    queryFn: async () => {
      return await axios.post<TxReceipt>("https://starknet-mainnet.public.blastapi.io", {
        "jsonrpc": "2.0",
        "method": "starknet_getTransactionReceipt",
        "params": [
          id
        ],
        "id": 1
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
    },
  })

  function splitDateTime() {
    const dateTimeStr = TimeStamp_MDYT_Converter(BlockData?.result.timestamp)
    if (dateTimeStr !== undefined) {
      const parts = dateTimeStr.split(' ');
      const time = parts.pop();
      const date = parts.join(' ');
      return { date, time };
    }
    else {
      return { date: '', time: "loading .." }
    }
  }

  const gas_consumed = () => {
    if (getTxReceipt.isSuccess && getTxDataByHash.isFetched) {
      const a = WeiToEtherConverter(HextoDecimalConverter(getTxReceipt.data?.data.result.actual_fee.amount))
      const b = WeiToEtherConverter(HextoDecimalConverter(getTxDataByHash.data!.l1_gas_price as string))

      if (a !== undefined && b !== undefined) {
        return a / b
      }
    }
  }

  const parseSignature = () => {
    const data: string = JSON.stringify(getTxDataByHash.data?.signature)

    if (data !== undefined && data !== null) {
      const parsed: string[] = JSON.parse(data) as string[]
      return parsed
    }
  }

  useEffect(() => {
    if (getTxDataByHash.data !== undefined && getTxDataByHash.data !== null) {
      console.log(getTxDataByHash.data.signature)
      parseSignature()
    }

    if (getTxReceipt.isSuccess && getTxDataByHash.data?.block !== undefined) {
      (async () => {
        try {
          const response = await axios.post<getTxType>("https://starknet-mainnet.public.blastapi.io", {
            "jsonrpc": "2.0",
            "method": "starknet_getBlockWithTxs",
            "params": [
              {
                "block_number": getTxReceipt.data?.data.result.block_number
              }
            ],
            "id": 1
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (response.status === 200) {
            setBlockData(response.data);
          }
        } catch (error) {
          console.error("Error fetching block data:", error);
        }
      })().catch(err => console.error(err));
    }
    else {
      console.log(getTxReceipt)
    }

  }, [getTxDataByHash.fetchStatus, getTxReceipt.status])


  if (getTxDataByHash.isError || getTxReceipt.isError || getTxReceipt.data?.data.result === null || getTxDataByHash.data === null) {
    return <div className="bg-[#1B1B1B] text-white p-8 min-h-screen max-h-fit">Uh Oh Please Try Again From the Main Page.....</div>
  }

  return (
    <>
      <div className="bg-[#1B1B1B] text-white p-8 min-h-screen max-h-fit">
        <h1 className="text-xl  mb-12">Transaction</h1>
        <Labelch label="HASH" className="mb-7">
          <div className="flex flex-row items-center space-x-2">
          <p>{id}</p>
           <span className="cursor-pointer p-3" onClick={async () => {
            try {
              if(id!==undefined)
              await handleCopy(id as string)
            }
            catch (err) {
              console
            }

          }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
          </span>
          </div>
        </Labelch>
        <div className="w-fit h-fit flex flex-row mb-8 ">
          <Labelch label="TYPE" className="mr-40 flex flex-col justify-start" OverrideLabelStyle="mb-1">
            <Chip label="INVOKE" backgroundColor="#202E26" textColor="#82F4BB" borderColor="#2E4C3C" />
          </Labelch>
          <Labelch label="TIMESTAMP" className="flex flex-col" OverrideLabelStyle="mb-1" >
            <p className="text-md flex flex-row items-center">{splitDateTime().date} &nbsp; <span className="text-xs font-thin">{splitDateTime().time}</span> </p>
          </Labelch>
        </div>
        <div>
          <Labelch label="STATUS" className="flex flex-col mb-9" >
            <TimeLine />
          </Labelch>


        </div>
        <div className="flex space-x-9 mb-8">

          <button onClick={() => setPageStatus(true)} className={`text-[#CACACA] text-sm  pb-4 hover:border-b-2 hover:border-[#a35d42] ${pageStatus == true && "border-b-2 border-[#BF6D4C]"}`}>
            Overview
          </button>

          <button onClick={() => setPageStatus(false)} className={`text-[#CACACA] text-sm  pb-4 flex flex-row items-center space-x-2 hover:border-b-2 hover:border-[#a35d42] active:border-[#BF6D4C] ${pageStatus == false && "border-b-2 border-[#BF6D4C]"} `}>
            <span> Events</span>
            <div className="bg-[#121212] px-2 py-1 rounded-xl">0</div>
          </button>
        </div>

        {pageStatus == true ? <><div className="h-fit w-full">
          <h1 className="text-xl  mb-6 ">Transaction Details</h1>
          <TxDetailsRow label="BLOCK NUMBER">
            <p className="text-[14px]">{getTxReceipt.data?.data.result.block_number ?? "loading ..."}</p>
          </TxDetailsRow>
          <TxDetailsRow label="timestamp"><p className="text-[14px]">{TimeStamp_MDYT_Converter(BlockData?.result.timestamp)}</p></TxDetailsRow>
          <TxDetailsRow label="Actual fee"><p className="text-[14px]">{WeiToEtherConverter(HextoDecimalConverter(getTxReceipt.data?.data.result.actual_fee.amount))} ETH ($0.004176)
            {/* \ to: StarkWare: Sequencer */}
          </p></TxDetailsRow>
          <TxDetailsRow label="max fee"><p className="text-[14px]">{getTxDataByHash.isFetched && WeiToEtherConverter(HextoDecimalConverter(getTxReceipt.data?.data?.result?.actual_fee?.amount))} ETH</p></TxDetailsRow>
          <TxDetailsRow label="gas consumed"><p className="text-[14px]">{Math.floor(gas_consumed() ?? 0)}</p></TxDetailsRow>
          <TxDetailsRow label="sender address"><p className="text-[14px]">{getTxDataByHash.isFetched && getTxDataByHash.data?.sender_address}</p></TxDetailsRow>
        </div>

          <div className="h-fit w-full mt-8">
            <h1 className="text-xl  mb-6 ">Developer Info</h1>
            <TxDetailsRow label="BLOCK NUMBER">
              <p className="text-[14px]">{getTxReceipt.data?.data.result.block_number}</p>
            </TxDetailsRow>
            <TxDetailsRow label="unix timestamp"><p className="text-[14px]">{BlockData?.result.timestamp}</p></TxDetailsRow>
            <TxDetailsRow label="nonce"><p className="text-[14px]">{HextoDecimalConverter(getTxDataByHash.data!.nonce as string)}</p></TxDetailsRow>
            <TxDetailsRow label="position"><p className="text-[14px]">{getTxDataByHash.data?.id}</p></TxDetailsRow>
            <TxDetailsRow label="version"><p className="text-[14px]">{HextoDecimalConverter(getTxDataByHash.data!.version as string)}</p></TxDetailsRow>


            {/* Execution Resources*/}
            <div className="flex h-fit py-2 max-h-fit flex-row">
              <div className="w-[250px] flex flex-row space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[16px] h-[16px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <span className="uppercase text-xs">EXECUTION RESOURCES:</span>
              </div>
              <div className="h-full w-full border-b-[1px] border-[#383838] pb-2 flex flex-row  items-center">
                <div className="h-fit w-fit flex flex-col space-y-1 justify-center items-start">
                  <div>
                    <Chip label={`${getTxReceipt.data?.data.result.execution_resources.steps} STEPS`} backgroundColor="#202E26" textColor="#82F4BB" borderColor="#2E4C3C" />
                  </div>

                  <div className="flex flex-row space-x-2">
                    <Chip label={`${getTxReceipt.data?.data.result.execution_resources.pedersen_builtin_applications} PEDERSEN_BUILTIN`} backgroundColor="#3b2a1c" textColor="#ffc899" borderColor="#583f2a" />
                    <Chip label={`${getTxReceipt.data?.data.result.execution_resources.range_check_builtin_applications} RANGE_CHECK_BUILTIN`} backgroundColor="#3b2a1c" textColor="#ffc899" borderColor="#583f2a" />
                    <Chip label={`${getTxReceipt.data?.data.result.execution_resources.ec_op_builtin_applications} EC_OP_BUILTIN`} backgroundColor="#3b2a1c" textColor="#ffc899" borderColor="#583f2a" />
                  </div>
                </div>
              </div>
            </div>

            {/* CallData */}
            <div className="flex h-fit py-2 max-h-fit flex-row mb-8">

              <div className="w-[250px] flex flex-row  space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[16px] h-[16px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <span className="uppercase text-xs">CALLDATA:</span>
              </div>

              <div className="h-[431px] w-full p-4 bg-[#252525]">


                <div className="flex overflow-auto mb-8">
                  <button

                    className="inline-flex bg-[#1b1b1b] items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
                    HEX
                  </button>
                  <button className="inline-flex bg-[#1b1b1b] items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
                    Dec
                  </button>
                  <button className="inline-flex bg-[#1b1b1b] items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-1 hover:bg-[#383838]">
                    Text
                  </button>

                </div>


                <div>
                  <div className="overflow-x-auto bg-[#1b1b1b] border-[#383838] h-[329px] overflow-y-auto">
                    <table className="table ">
                      {/* head */}
                      <thead className="">
                        <tr className="border-[#383838]">
                          <th className="py-7 font-medium">INPUT</th>
                          <th className="py-7 font-medium">VALUE</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        <tr className="hover border-[#383838]">
                          <th className="py-7">1</th>
                          <td>Cy Ganderton</td>
                          <td>copy</td>
                        </tr>
                        {/* row 2 */}
                        <tr className="hover border-[#383838]">
                          <th className="py-7 ">2</th>
                          <td>Hart Hagerty</td>
                          <td>copy</td>
                        </tr>
                        {/* row 3 */}
                        <tr className="hover border-[#383838]">
                          <th className="py-7 ">3</th>
                          <td>Brice Swyre</td>
                          <td>copy</td>
                        </tr>
                        {/* row 4 */}
                        <tr className="hover border-[#383838]">
                          <th className="py-7 ">3</th>
                          <td>Brice Swyre</td>
                          <td>copy</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            <TxDetailsRow label="SIGNATURE(S)">
              <div className="h-full w-full">
                <div className="h-full w-full border-t-[1px] border-[#383838] flex flex-row  items-center">
                  <p className="text-[14px] text-[#f5ab35]">{parseSignature()?.[0] ?? ''}</p>
                </div>
                <div className="h-full w-full border-t-[1px] border-b-[1px] border-[#383838] flex flex-row  items-center">
                  <p className="text-[14px] text-[#f5ab35]">{parseSignature()?.[1] ?? ''}</p>
                </div>
              </div>
            </TxDetailsRow>
            &nbsp;
          </div></> : <>
          <div className="h-fit w-full">
            <table className="w-full caption-bottom text-sm">
              <thead className=" border border-[#4B4B4B] border-x-0">
                <tr className="text-xs text-[#AAAAAA]">
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    ID
                  </th>
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    BLOCK
                  </th>
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    AGE
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs ">
                <tr className="border border-[#4B4B4B] border-x-0" >

                  <td className="h-10 px-4  align-middle "><span className="text-white">{getTxDataByHash.data?.id}</span></td>
                  <td className="h-10 px-4 align-middle "><span className="text-white">{getTxReceipt.data?.data.result.block_number ?? "loading ..."}</span></td>
                  <td className="h-10 px-4 align-middle "><span className="text-white">bgyhjgui</span></td>
                </tr>

              </tbody>
            </table>
          </div>
        </>}



      </div>
    </>
  );
}