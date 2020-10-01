import { readable } from 'svelte/store';

export const polls = readable([], async set => {
    set(await fetchPolls())
  })


const fetchPolls = async () => {
	try {
		// fetch the data (it arrives as json)
    const raw = await fetch('https://mm.aftenposten.no/api/drive/mirror/USElectionPollTimeline');
    const data = await raw.json()
    return data
	} catch(error) {
    console.log('error', error)
	}
}