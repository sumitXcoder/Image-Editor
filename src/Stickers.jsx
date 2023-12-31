import { memo } from 'react'
import { Box, Grid } from "@chakra-ui/react"
import { myCanvas, panelStyle } from "./App"
import { img } from "./Text"

const stickerProps = { cornerStyle: "circle", cornerStrokeColor: "#000", cornerSize: "20", padding: 12, cornerColor: "#FFFFFF", transparentCorners: false }

const addImgToCanvas = string => {
  fabric.loadSVGFromURL(string, function (objects, options) {
    const sticker = fabric.util.groupSVGElements(objects, options)
    Object.assign(sticker, stickerProps)
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: -0.5, y: -0.5, cursorStyle: 'pointer',
      mouseUpHandler: function () {
        myCanvas.current.remove(myCanvas.current.getActiveObject());
      },
      render: function (ctx, left, top) {
        const size = this.cornerSize;
        ctx.translate(left, top);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      },
      cornerSize: 20
    })
    myCanvas.current.add(sticker)
  })
}

const Emojis = memo(() => {
  return (
    <Box w="max-content" sx={panelStyle}>
      <Grid gridTemplateColumns="repeat(3,1fr)" gap="1.5em" w="15em" h="12em" overflowY="scroll" padding=".5em">
        {Array.from({ length: 30 }, (_, index) => index + 1).map(file => {
        return <img key={file} src={"https://raw.githubusercontent.com/sumitXcoder/Image-Editor/dddc0e879896e14c43bbb40ddd03cd388c86e58a/assets/0/" + file + ".svg"} onClick={e => addImgToCanvas(e.target.src)} />
      })}
      </Grid>
    </Box>
  )
})
export default function Stickers() {
  return <Emojis />
}

