import { Slide } from "./Slide";
import { SlideLayout } from "./SlideLayout";
import contentData from "./data.json";

function App() {
    const slides = contentData.map(makeSlide);
    return (
        <div className="h-screen w-screen">
            <SlideLayout>{slides}</SlideLayout>
        </div>
    );
}

interface SlideData {
    title: string;
    description: string;
    imageName: string;
    extraImage: string;
}

function makeSlide({ title, description, imageName, extraImage }: SlideData) {
    return (
        <Slide className="flex flex-col gap-3 font-sans md:grid md:grid-cols-2 md:grid-rows-12">
            <h1 className="flex items-center justify-center rounded-lg p-3 text-center text-lg leading-none font-bold backdrop-brightness-85 md:col-start-2 md:row-span-2 lg:text-2xl">
                {title}
            </h1>
            <div className="h-full w-full self-center overflow-clip rounded-xl p-3 backdrop-brightness-85 md:col-start-1 md:row-span-12 md:row-start-1">
                <img
                    src={imageName}
                    className="h-full w-full rounded-lg object-cover object-center"
                />
            </div>
            <p className="flex items-center justify-center rounded-xl p-3 text-center text-lg font-light backdrop-brightness-85 md:row-span-4 md:min-h-full md:text-xl lg:text-2xl xl:text-3xl">
                {description}
            </p>
            <div className="hidden self-center overflow-clip rounded-xl p-3 backdrop-brightness-85 md:col-start-2 md:row-span-6 md:row-start-7 md:block md:h-full md:w-full md:pt-3">
                <img
                    className="h-full w-full rounded-lg object-cover object-center"
                    src={extraImage}
                />
            </div>
        </Slide>
    );
}

export default App;
