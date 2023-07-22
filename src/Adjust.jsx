import React, { useContext } from "react"
import { Box, Text, Slider, Flex } from "@chakra-ui/react"
import { MyContext, panelStyle, SliderContent } from './App'

export const Property = ({ prop, value }) => {
  return (
    <Flex justifyContent="space-between" >
      <Text fontWeight="400" letterSpacing="1px" fontSize={15}>{prop.replace(prop[0], prop[0].toUpperCase())}</Text>
      <Box fontSize={14} border="1px solid var(--outline-color-low)" padding="0px 5px" borderRadius=".25em">{value}
      </Box>
    </Flex>
  )
}
export default function Adjust() {
  const { filters, setFilters, filterValue, addToHistory } = useContext(MyContext)
  return (
    <Box w="15em" sx={panelStyle}>{
      ["brightness", "contrast", "saturation", "rotation"].map(filter => {
        return (
          <React.Fragment key={filter}>
            <Property prop={filter} value={filterValue(filters[filter])} />
            <Slider defaultValue={0} min={-100} max={100} onChange={value => setFilters({ ...filters, [filter]: value / 100 })} onChangeEnd={value => addToHistory(null, { [filter]: value / 100 }, null, null)}>
              <SliderContent />
            </Slider>
          </React.Fragment>
        )
      })}
    </Box>
  )
}