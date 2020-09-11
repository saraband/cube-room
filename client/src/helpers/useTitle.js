import { useEffect } from 'react'

export default function useTitle (title, deps = []) {
  useEffect(() => {
    document.title = title
  }, deps)
}