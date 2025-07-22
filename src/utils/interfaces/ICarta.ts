import { StaticImageData } from "next/image"

export default interface ICarta {
        src: {
          dadoImagem: StaticImageData
          nome: string
        }
}