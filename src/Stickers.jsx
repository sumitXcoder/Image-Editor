import React, { useState } from 'react'
import { Box, Tab, Tabs, TabPanels, TabPanel, TabList, Grid } from "@chakra-ui/react"
import { myCanvas, panelStyle } from "./App"
import { BsGlobe } from "react-icons/bs"
import { TbMoodSmile, TbDog, TbPlant } from "react-icons/tb"


const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const img = document.createElement('img');
img.src = "assets/remove.svg";
export default function Stickers() {
  var i = 0
  const [tab, setTab] = useState(0)
  const stickerProps = { cornerStyle: "circle", cornerStrokeColor: "#000", cornerSize: "20", padding: 12, cornerColor: "#FFFFFF", transparentCorners: false }

  const addImgToCanvas = string => {
    fabric.loadSVGFromURL(`assets/${tab}/${string.slice(string.lastIndexOf("/") + 1)}`, function (objects, options) {
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
  return (
    <>
      <Box w="max-content" sx={panelStyle}>
        <Grid gridTemplateColumns="repeat(3,1fr)" gap="1.5em" w="15em" h="12em" overflowY="scroll" padding=".5em">{numbers.map(file => {
          return <img key={file} src={"assets/0/" + file + ".svg"} onClick={e => addImgToCanvas(e.target.src)} />
        })}
        </Grid>
      </Box>
    </>
  )
}
