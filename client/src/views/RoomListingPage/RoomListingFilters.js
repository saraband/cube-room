import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Flex from 'components/ui/Flex'
import BaseInput from 'components/form/BaseInput'
import { debounce } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Routes, { generateRoute } from 'constants/Routes'
import BaseButton from 'components/form/BaseButton'
import { SET_ROOM_LISTING_FILTERS } from 'store'
import WandSrc from 'assets/icons/wand.svg'
import BaseSelect from 'components/form/BaseSelect'

export const OrderByOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-viewed', label: 'Most viewed' },
  { value: 'least-viewed', label: 'Least viewed' },
]

function RoomListingFilters () {
  const history = useHistory()
  const dispatch = useDispatch()

  const [localFilters, setLocalFilters] = useState(useSelector(state => state.roomListingFilters))

  /**
   * Whenever the user changes a filter, trigger a refetching of the list
   */
  const debounceUpdateGlobalFilters = useCallback(
    debounce((filters) => {
      dispatch({
        type: SET_ROOM_LISTING_FILTERS,
        filters,
      })
    }, 300),
    [dispatch]
  )

  useEffect(() => {
    debounceUpdateGlobalFilters(localFilters)
  }, [localFilters])

  const handleFilterChange = (filterKey, filterValue) => {
    setLocalFilters({
      ...localFilters,
      [filterKey]: filterValue,
    })
  }

  return (
    <StyledFilters>
      <BaseInput
        name="searchString"
        placeholder="Search..."
        value={localFilters.searchString}
        onChange={(e) => handleFilterChange('searchString', e.target.value)}
      />
      <Flex>
        <BaseSelect
          value={localFilters.orderByKey}
          onChange={(e) => handleFilterChange('orderByKey', e.target.value)}
        >
          {OrderByOptions}
        </BaseSelect>
        <CreateRoomButton onClick={() => history.push(generateRoute(Routes.CREATE_ROOM))}/>
      </Flex>
    </StyledFilters>
  )
}

const StyledFilters = styled(Flex).attrs(() => ({
  justifyBetween: true,
}))`

`

const CreateRoomButton = styled(BaseButton).attrs(() => ({
  children: 'Create a room',
  icon: WandSrc,
}))`
  margin-left: 16px;
`

export default RoomListingFilters
