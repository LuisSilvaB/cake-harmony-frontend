'use client'
import cx from '@/utils/cx'
import React, { useEffect } from 'react'
import { poppins } from '@/fonts'
import TagDialog from '../../ui/dialogs/tagDialog'
import { useDispatch, useSelector} from 'react-redux' 
import { AppDispatch, RootState } from '@/redux/store'
import { getTags } from '../../../feature/tags.feature'

const TagsHeader = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { mainTags, tags, loadingMainTags } = useSelector((state: RootState) => state.tags)
  useEffect(() => {
    const fetchData = async () => {
      if (tags.length &&  mainTags.length) return;
      await dispatch(getTags())
    }
    fetchData()
  }, [dispatch])
  return (
    <div
      className={cx(
        "flex h-auto items-center justify-between pb-2 text-xl font-medium",
        poppins.className,
      )}
    >
      <p>Categorías</p>
      <TagDialog mainTags = {mainTags}  loadingMainTags = {loadingMainTags} />
    </div>
  )
}

export default TagsHeader