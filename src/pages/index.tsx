import Head from "next/head";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { transactionType } from "~/types";
import { TimeStamp_ago_Converter } from "~/utils/Converter";
import { v4 as uuidv4 } from 'uuid'
import Chip from "~/components/Chip";
import Link from "next/link";
import { useCopyToClipboard } from 'usehooks-ts'
import toast from "react-hot-toast";

export default function Home() {
  const [page, setPage] = useState(0)
  const transactionData = api.transaction.getTransactions.useQuery()
  const [txData, setTxData] = useState<transactionType[]>([])
  const [filterState, setFilterState] = useState<string>("ALL")
  const [copiedText, copy] = useCopyToClipboard()
  const TxPagination = api.transaction.paginateTransactions.useMutation({
    onSuccess: ((res) => {
      setTxData(prevData => Array.from([...prevData, res]))
    })
  })

  const TxCustomPagination = api.transaction.CustomPaginateTransactions.useMutation({
    onSuccess: ((res) => {
      setTxData([res])

    })
  })

  const handleCopy = async(text: string) => {
    await copy(text)
      .then(() => {
        console.log('Copied!', { text })
        toast.success('Copied to clipboard')
      })
      .catch(error => {
        console.error('Failed to copy!', error)
      })
  }

  const handlePaginate = async () => {
    setPage(page + 25)
    console.log(page, "page")
    console.log(txData, "txData")
    TxPagination.mutate({ skip: page })
    // console.log(page, "page", txData, "txData")
  }

  const fetchTransactions = async () => {
    TxPagination.mutate({ skip: page });
  };



  useEffect(() => {
    fetchTransactions().catch((err) => { console.log(err) })
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (page === 0) {
        TxCustomPagination.mutate({
          skip: 0,
          take: 25
        });
      } else {
        TxCustomPagination.mutate({
          skip: 0,
          take: page
        });
      }
    }, 35000);

    return () => clearInterval(intervalId);
  }, [page, TxCustomPagination]);

  const filteredTxData = txData?.flatMap(txd =>
    txd
      ?.filter(tx => tx.type == filterState)
      .map(tx => {
        console.log(filterState, "filterTxData")
        return (
          <tr className="border border-[#4B4B4B] border-x-0" key={uuidv4()}>
            <td className="h-9 px-4 align-middle">
              <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
              </svg>
            </td>
           <td className="h-10 px-4 align-middle flex flex-row items-center space-x-3">
            
            <Link className="text-[#8ba3df] hover:text-[#a3bdff]" href={`/tx/${tx.hash}`}>{tx.hash}</Link>
            <span className="cursor-pointer p-3" onClick={async()=> {

              try{
              await handleCopy(tx.hash)}
              catch(err) {
                console
              }
              
              }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
          </span>
          
          </td>
            <td className="h-10 px-4 align-middle">
              {tx.type === "DECLARE" && <Chip label={tx.type} backgroundColor="#202e26" textColor="#feffb5" borderColor="#6b7d07" />}
              {tx.type === "INVOKE" && <Chip label={tx.type} backgroundColor="#202E26" textColor="#82F4BB" borderColor="#2E4C3C" />}
              {tx.type === "L1_HANDLER" && <Chip label={tx.type} backgroundColor="#383838" textColor="white " borderColor="#5e5e5e" />}
              {tx.type === "DEPLOY_ACCOUNT" && <Chip label="DEPLOY_ACCOUNT" backgroundColor="#223655" textColor="#d2e5ff" borderColor="#3c3c6e" />}
              {tx.type === "DEPLOY" && <Chip label="DEPLOY" backgroundColor="#223655" textColor="#d2e5ff" borderColor="#3c3c6e" />}
            </td>
            <td className="h-10 px-4 align-middle">{tx.block}</td>
            <td className="h-10 px-4 align-middle">{TimeStamp_ago_Converter(tx.age)}</td>
          </tr>
        );
      })
  );

  const txDataRendered = txData?.flatMap(txd =>
    txd?.map(tx => {
      console.log(filterState, "txdatarendered")
      return (
        <tr className="border border-[#4B4B4B] border-x-0" key={tx.id}>
          <td className="h-9 px-4 align-middle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
          </td>
          <td className="h-10 px-4 align-middle flex flex-row items-center space-x-3">
            
            <Link className="text-[#8ba3df] hover:text-[#a3bdff]" href={`/tx/${tx.hash}`}>{tx.hash}</Link>
            <span className="cursor-pointer p-3" onClick={async()=> {

              try{
              await handleCopy(tx.hash)}
              catch(err) {
                console
              }
              
              }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
          </span>
          
          </td>
          <td className="h-10 px-4 align-middle">
            {tx.type === "DECLARE" && <Chip label="DECLARE" backgroundColor="#202e26" textColor="#feffb5" borderColor="#6b7d07" />}
            {tx.type === "INVOKE" && <Chip label="INVOKE" backgroundColor="#202E26" textColor="#82F4BB" borderColor="#2E4C3C" />}
            {tx.type === "L1_HANDLER" && <Chip label="L1_HANDLER" backgroundColor="#383838" textColor="white " borderColor="#5e5e5e" />}
            {tx.type === "DEPLOY_ACCOUNT" && <Chip label="DEPLOY_ACCOUNT" backgroundColor="#223655" textColor="#d2e5ff" borderColor="#3c3c6e" />}
            {tx.type === "DEPLOY" && <Chip label="DEPLOY" backgroundColor="#223655" textColor="#d2e5ff" borderColor="#3c3c6e" />}
          </td>
          <td className="h-10 px-4 align-middle">{tx.block}</td>
          <td className="h-10 px-4 align-middle">{TimeStamp_ago_Converter(tx.age)}</td>
        </tr>
      );
    })
  );





  return (
    <>
      <Head>
        <title>Karnot</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="bg-[#1B1B1B] text-white p-8 min-h-screen max-h-fit">
        <h1 className="text-2xl  mb-2">Transactions</h1>
        <p className="text-sm  mb-6 text-[#CACACA]">A list of transactions on Starknet </p>
        <InfiniteScroll
          dataLength={txData.length}
          next={async () => await handlePaginate()}
          hasMore={true}
          scrollThreshold={0.7}
          loader={<h4>Loading...</h4>}
          endMessage={"bye bye"}
        >


          <div className="flex overflow-auto mb-8">
            <button
              onClick={() => { setFilterState("ALL") }}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
              All
            </button>
            <button onClick={() => { setFilterState("DECLARE") }} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
              declare
            </button>
            <button onClick={() => { setFilterState("DEPLOY") }} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
              deploy
            </button>
            <button onClick={() => { setFilterState("DEPLOY_ACCOUNT") }} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
              deploy_account

            </button>
            <button onClick={() => { setFilterState("INVOKE") }} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B] border-r-0 hover:bg-[#383838]">
              invoke
            </button>
            <button onClick={() => { setFilterState("L1_HANDLER") }} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 py-2 px-4  text-white border border-[#4B4B4B]">
              l1_handler
            </button>
          </div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className=" border border-[#4B4B4B] border-x-0">
                <tr className="text-xs text-[#AAAAAA]">
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    STATUS
                  </th>
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    HASH
                  </th>
                  <th className="h-10 px-4 align-middle font-medium text-muted-foreground  text-left">
                    TYPE
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

                {
                  filterState == "ALL" && txDataRendered
                }
                {
                  filterState !== "ALL" && filteredTxData
                }

                {
                  txData.length == 0 || TxPagination.isError || TxCustomPagination.isError && <>
                    <tr className="border border-[#4B4B4B] border-x-0" >
                      <td className="h-9 px-4 align-middle ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 ">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                        </svg>

                      </td>
                      <td className="h-10 px-4  align-middle "><span className="bg-gray-400 animate-pulse text-transparent">uiagviur eaeriuqgfrufgiurgf  reiuwfgiuerwgfiurfiuew  r</span></td>
                      <td className="h-10 px-4 align-middle "><span className="bg-gray-400 animate-pulse text-transparent">INVOKE</span></td>
                      <td className="h-10 px-4 align-middle "><span className="bg-gray-400 animate-pulse text-transparent">t1284151</span></td>
                      <td className="h-10 px-4 align-middle "><span className="bg-gray-400 animate-pulse text-transparent">TimeStamp_ago_Converter</span></td>
                    </tr>
                  </>
                }

              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}
