import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const TimeStamp_ago_Converter = (timestamp:number) => {
    const time = dayjs(timestamp * 1000);
    const now = dayjs();
    return time.from(now)
}

export const TimeStamp_MDYT_Converter = (timestamp:number | undefined) => {
    const formatString = 'MMM D YYYY HH:mm:ss';

    if(timestamp !==undefined){
    const time = dayjs(timestamp * 1000);
    return time.format(formatString);}
}


export const HextoDecimalConverter = (hex:string|undefined) => {
    if(hex !== undefined){
          return parseInt(hex, 16);
    }
}

export const WeiToEtherConverter = (wei:number|undefined) => { 
    if(wei !== undefined){
        const weiValue = BigInt(wei);
        const etherValue = Number(weiValue) / 1e18;
        return etherValue;}
}