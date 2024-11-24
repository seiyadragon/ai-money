import FallBackImage from "./fallback-image"

export default function Header() {
  return (
    <>
      <div>
        <div 
          className="
            w-full
            text-center 
            font-bold
            text-3xl
            text-green-400
            mx-auto
            -mt-10
            md:text-5xl
            lg:text-7xl
            relative
            z-10
            top-56
          "
        >
          <h1 className="mx-auto drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            TRACK YOUR FINANCES WITH AI
          </h1>
        </div>
        <FallBackImage
          className="w-full -mt-12 md:-mt-32 lg:-mt-32 z-0"
          src="https://vvuzagvjpovdibhoxtvm.supabase.co/storage/v1/object/sign/page_gallery/HERO.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYWdlX2dhbGxlcnkvSEVSTy5wbmciLCJpYXQiOjE3MzI0Mjg5ODYsImV4cCI6MzE3MDYwODkyOTg2fQ.oe-nZ2TzROd_LfraAN-pbRo_dzEkM3f8rY6lSGgexdc&t=2024-11-24T06%3A16%3A26.235Z"
          alt=""
          width={1920}
          height={1080}
          fallbackSrc="/images/placeholder_image.png"
        />
      </div>
    </>
  );
}
