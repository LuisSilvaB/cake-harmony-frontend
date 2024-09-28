import TagsTable from '../../ui/tagsTable'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { FaSpinner } from 'react-icons/fa'
import { TagsType } from '../../../types/tags.type'

type TagsBodyProps = {
  mainTags: TagsType[]
}

const TagsBody = () => {
  const { tags, loading } = useSelector((state: RootState) => state.tags)
  const { mainTags, loadingMainTags } = useSelector((state: RootState) => state.tags)
  
  if (loading || loadingMainTags)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className=''>
      <TagsTable tags = {tags} mainTags = {mainTags} />
    </div>
  )
}

export default TagsBody