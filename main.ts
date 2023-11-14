import { $, echo } from 'npm:zx'

const r = await $`git branch --show-current`
echo`${r}`

