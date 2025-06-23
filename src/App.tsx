import { Slide } from "./Slide"
import { SlideLayout } from "./SlideLayout"

function App() {
  return (
    <div className="w-screen h-screen">
      <SlideLayout>
        <Slide>
          <SlideLayout>
            <Slide>SS1</Slide>
            <Slide>SS2</Slide>
          </SlideLayout>
        </Slide>
        <Slide>S2</Slide>
        <Slide>S3</Slide>
        <Slide>S4</Slide>
      </SlideLayout>
    </div>
    
  )
}

export default App
