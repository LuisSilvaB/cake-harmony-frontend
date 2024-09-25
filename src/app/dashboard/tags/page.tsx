'use client'
import React, { lazy, useEffect } from 'react'
import Layout from './layout'

const TagsHeader = lazy(()=>import("./components/layout/tagsHeader"))
const TagsBody = lazy(()=>import("./components/layout/tagsBody"))

const TagsPage = () => {

  return (
    <Layout>
      <TagsHeader />
      <TagsBody />   
    </Layout>
  )
}

export default TagsPage