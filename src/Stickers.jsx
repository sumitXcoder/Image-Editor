import React, { useState } from 'react'
import { Box, Tab, Tabs, TabPanels, TabPanel, TabList,  Grid } from "@chakra-ui/react"
import { myCanvas } from "./App"
import {  BsGlobe } from "react-icons/bs"
import { TbMoodSmile,TbDog, TbPlant } from "react-icons/tb"


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
        <Box w="max-content" bg="rgba(100,100,100,.5)" color="white"  shadow={10} backdropFilter="blur(10px)" outline="1px solid var(--outline-color)" p="0"  borderRadius=".5em">
          <Tabs variant="unstyled" colorScheme="blue" onChange={index => setTab(index)}>
            <TabList>
              {[<TbMoodSmile fontSize="1.5em"/>, <TbDog fontSize="1.5em"/>, <TbPlant fontSize="1.5em"/>, <BsGlobe fontSize="1.25em"/>].map(item => {
                return (<Tab key={i++} color="white" _selected={{ boxShadow: "0 0 1px 1px lightblue", bg: "#5c809caa", borderRadius: ".25em" }} m=".5em">{item}</Tab>)
              })}
            </TabList>
            <TabPanels>{[0, 1, 2, 3].map(folder => {
              return (
                <TabPanel p="0 .5em .25em .5em" key={i++}>
                  <Grid gridTemplateColumns="repeat(3,1fr)" gap="1.5em" h="12em" overflowY="scroll" paddingRight=".5em">{numbers.map(file => {
                      return <img key={file} src={"assets/" + folder + "/" + file + ".svg"} onClick={e => addImgToCanvas(e.target.src)} />
                  })}
                  </Grid>
                </TabPanel>)
            })}</TabPanels>
          </Tabs>
        </Box>
    </>
  )
}
