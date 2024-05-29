import { db } from "~/server/db";
import { GetLatestBlockResponseType, getTransactionsType } from "~/types/index"
import axios from "axios";

export const cronJob = async () => {
    try {
        console.log("Cron Job Started")
        await axios.post("https://starknet-mainnet.public.blastapi.io", {
            "jsonrpc": "2.0",
            "method": "starknet_blockNumber",
            "params": [],
            "id": 1
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res: GetLatestBlockResponseType) => {
            if (res.status == 200) {
                const blockNumber: number = res.data.result;
                if (blockNumber !== undefined || blockNumber !== null) {
                    const temp_block_number = blockNumber - 10;

                    for (let i = temp_block_number; i <= blockNumber; i++) {
                        await axios.post("https://starknet-mainnet.public.blastapi.io", {
                            "jsonrpc": "2.0",
                            "method": "starknet_getBlockWithTxs",
                            "params": [
                                {
                                    "block_number": i
                                }
                            ],
                            "id": 1
                        }, {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(async (res: getTransactionsType) => {
                            if (res.status == 200) {
                               
                                for (const j of res.data.result.transactions) {
                                    await db.transactions.create({
                                        data: {
                                            status: res.data.result.status,
                                            hash: j.transaction_hash,
                                            type: j.type,
                                            block: res.data.result.block_number,
                                            age: res.data.result.timestamp,
                                            max_fee: j.max_fee,
                                            nonce: j.nonce,
                                            sender_address : j.sender_address,
                                            signature: j.signature,
                                            version: j.version,
                                            l1_gas_price: res.data.result.l1_gas_price.price_in_wei
                                        }
                                    }).then(() => {
                                        console.log("Data Created successfully refreshes in 30 seconds")
                                        return {
                                            message: "Data Created successfully refreshes in 30 seconds"
                                        }
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }
                            }
                            else {
                                console.log({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch data at getTransactions" })
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                }
            }
        })

    }
    catch (err) {
        console.log({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch data ", err })
    }
}   
