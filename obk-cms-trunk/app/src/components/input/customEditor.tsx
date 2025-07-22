import dynamic from 'next/dynamic'

const CustomEditor = dynamic(() => import('./baseCustomEditor'), {
  ssr: false,
})

export default CustomEditor
