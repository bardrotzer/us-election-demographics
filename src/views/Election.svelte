<main>
  <!-- <div class="text-blue-600 h-full50 border"> -->
    <article class="w-full lg:w-3/4 border mx-auto">
    <Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
      <!-- <canvas class="border m-2" bind:this={mapElement} height={height} width={width} ></canvas> -->
      <div slot="background" class="h-screen grid grid-rows-3 grid-cols-3 gap-4">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div style={`height: ${height}px; width: ${width}px;`} class="row-span-2 col-span-2" bind:this={mapElement}></div>
        <div></div>
      </div>


      <div slot="foreground">
        <!-- first item -->
        <section  class="h-screen grid grid-rows-3 grid-cols-3 gap-4">
          <div class="col-span-3">
            <div class="flex flex-col p-2">
              <div>
                <h1 class="text-2xl pb-2">Do you remember the 2016 election?</h1>
              </div>
              <div>
                For a republican (and especially for Trump) the map showed a massive win 88% of the us territory voted 
                Donald Trump as the 45th US president.
              </div>
            </div>
          </div>
          <div class="bg-blue-200">here</div>
          <div class="row-span-2 col-span-2"></div>
          <div>
            Scroll to see the republican share share
            
          </div>
          
        </section>
        
        <!-- second item item -->
        <section class="h-screen grid grid-rows-3 grid-cols-3 gap-4">
          <div class="col-span-3">
            <div class="flex flex-col p-2">
              <div>
                <h1 class="text-2xl pb-2">Trump killed the competition?</h1>
              </div>
              <div>
                Wows 88% of teh land
              </div>
            </div>
          </div>
          <div class="bg-blue-200">here</div>
          <div class="row-span-2 col-span-2"></div>
          <div>
            Scroll to see the democrats share
            
          </div>
        </section>

        <section class="h-screen">
          <div class="flex flex-row">
            <div>
              <button class="border rounded mr-4 p-1" on:click={setPopularVote} value="popular">Popular</button>
            </div>
            <div>
              <button class="border rounded mr-4 p-1" value="geographic" on:click={setGeographicVote} >Geographic</button>
            </div>
          </div>
          <div class="flex flex-row">
            <div><button class="border rounded mr-4 p-1 text-link" value="absolute" on:click={setColor}>Absolute</button></div>
            <div><button class="border rounded mr-4 p-1" value="dem" on:click={setColor}>Democratic only</button></div>
            <div><button class="border rounded mr-4 p-1" value="rep" on:click={setColor}>Republicans only</button></div>
            <div><button class="border rounded mr-4 p-1" value="weight" on:click={setColor}>By vote</button></div>
          </div>
        </section>

        <section class="h-screen">
          <h1 class="text-2xl pb-2">By real vote</h1>
        </section>

        <section class="h-screen">
          <h1 class="text-2xl pb-2">By vote and people</h1>
        </section>
      </div>


  </Scroller>
</article>
  <!-- </div> -->
</main>

<script>
  import { onMount } from 'svelte'
  import Scroller from '@sveltejs/svelte-scroller';
  import UsMap from '@/components/UsMap.js'

  let map
  let height = 400
  let width = 600
  let mapElement
  let index
  let offset
  let progress

  $: if (map) {
    console.log(index)
    if (index === 0) {
      map.setColor('absolute')
    }
    if(index === 1) {
      map.setColor('rep')
    }
    if(index === 2) {
      map.setColor('dem')
    }
    if(index === 3) {
      map.setColor('weight')
      map.transition('geographic')
    }
    if (index === 4) {
      map.setColor('weight')
      map.transition('popular')
    }
  }

  onMount(async () => {
    map = new UsMap(width, height)
    await map.load()
    map.draw(mapElement)
    map.setColor()
  })

  const setPopularVote = () => {
    if (map) {
      map.transition('popular')
    }
  }

  const setGeographicVote = () => {
    if (map) {
      map.transition('geographic')
    }
  }

  const setColor = e => {
    if (map) {
      map.setColor(e.target.value)
    }
    console.log(e)
  }

	// export let name;
</script>


<style>

</style>