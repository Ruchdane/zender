import {listen,emit} from '@tauri-apps/api/event'
import {invoke} from '@tauri-apps/api'

/*async*/ function  setup() {
    invoke('who_invoked_you',{
        invoker:'Dom content loader'
    })
    // const unlisten = await listen('click',event=>{
    //     invoke('who_invoked_you',{
    //         invoker:'Click event caught by the frontend'
    //     })
    // })
    document.addEventListener('DOMContentLoaded', () => {
        // This will wait for the window to load, but you could
        // run this function on whatever trigger you want
        invoke('close_splashscreen')
        invoke('who_invoked_you',{
            invoker:'Dom content loader'
        })
      })
}
export {
    setup
}