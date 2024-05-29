import { AxiosResponse } from "axios";
import { Transactions } from "@prisma/client";
import { ReactNode } from "react";

export interface GetLatestBlockResponseType extends AxiosResponse {
    data: {
        result: number
    };
}


export interface getTransactionsType extends AxiosResponse {
    data: {
        result: {
            status: string,
            block_number: number,
            timestamp: number,
            l1_gas_price: {
                price_in_wei: string
            }
            transactions: [
                {
                    transaction_hash: string,
                    type: string,
                    max_fee: string,
                    sender_address: string,
                    nonce: string,
                    version: string,
                    signature: []
                }
            ]
        }
    }
}


export type transactionType = Transactions[] | undefined


export interface LabelWCProps {
    children?: ReactNode;
    label?: string;
    className?: string;
    OverrideLabelStyle?: string;
}

export type TxRowComponet = {
    label?: string,
    children?: ReactNode
}


export type ChipProps = {
    label?: string,
    backgroundColor?: string,
    textColor?: string
    borderColor?: string
}


export type TxReceipt = {
    result: {
        block_number: number,
        actual_fee: {
            amount: string,
            unit: string
        }
        execution_resources: {
            steps: number,
            pedersen_builtin_applications: number,
            ec_op_builtin_applications: number,
            range_check_builtin_applications: number
        }
    }
}

export type getTxType = {
    result: {
        status: string,
        block_number: number,
        timestamp: number,
        l1_gas_price: {
            price_in_wei: string
        }
        transactions: [
            {
                transaction_hash: string,
                type: string,
                max_fee: string,
                sender_address: string,
                nonce: string,
                version: string,
                signature: []
            }
        ]
    }
}