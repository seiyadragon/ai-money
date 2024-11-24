"use client";

import Image from "next/image"
import { useEffect, useState } from "react";

type FallbackImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    fallbackSrc: string;
    className?: string;
}

const FallBackImage = (props: FallbackImageProps) => {
    const [currentSrc, setCurrentSrc] = useState<string>(props.src);

    useEffect(() => {
        setCurrentSrc(props.src);
    }, [props.src]);

    return <Image
        className={`rounded-2xl ${props.className}`}
        src={currentSrc ? currentSrc : props.fallbackSrc} 
        alt={props.alt} 
        width={props.width} 
        height={props.height} 
        onError={() => {
            setCurrentSrc(props.fallbackSrc);
        }}
    />
}

export default FallBackImage