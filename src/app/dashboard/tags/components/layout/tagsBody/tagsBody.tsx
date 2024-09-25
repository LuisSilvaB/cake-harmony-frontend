import React, {useEffect} from 'react'
import TagsTable from '../../ui/tagsTable'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getTags } from '../../../feature/tags.feature'
import { FaSpinner } from 'react-icons/fa'

const TagsBody = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tags, loading } = useSelector((state: RootState) => state.tags)

  useEffect(() => {
    dispatch(getTags())
  }, [dispatch])

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className=''>
      <TagsTable tags = {tags} />
    </div>
  )
}

export default TagsBody