const searchInput = document.getElementById("searchBar");
// const apiKey = "AIzaSyDsig-SzLP_5kicvhamY8ZgnXMmg5zK16g";
const apiKey = "AIzaSyDMgL3wykeqn_YgepTEaOSz47aMKE8t2to";
localStorage.setItem("api_key", apiKey);
const videoContainer = document.getElementById("videoContainer");
// endpoint
// https://youtube.googleapis.com/youtube/v3/serach?part=snippet,
// statistics&maxResult=1&q=mycodeschool&key=(myapikey)
// https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResult=2&q=cats&key=AIzaSyDA-OAXPNXvgwW-9iZVRoICyxIRWNoO1h8

// default function which is used to display random videos once the page load

window.addEventListener('load', ()=> {
    var text = document.getElementById("text");
    function display(){
        text.classList.add("hidden");
        videoContainer.classList.remove("hidden");
        searchVideos();
    }
    
    setTimeout(display, 3000);
})

function searchVideos()
{
    let searchValue = searchInput.value;

    // fetch the videos
    fetchVideos(searchValue);
}

async function fetchVideos(searchValue){
    // api call
    let endPoint = `https://youtube.googleapis.com/youtube/v3/search?part=
    snippet&maxResults=40&q=${searchValue}&key=${apiKey}`

    try{
      let response = await fetch(endPoint);
      let result = await response.json();
      for(let i=0; i<result.items.length; i++){
        let video = result.items[i];
        let videoStats =   await fetchStats(video.id.videoId);

 
        if(videoStats.items.length > 0)
        result.items[i].videoStats = videoStats.items[0].statistics;
        result.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;  
    }
      console.log(result)

      showThumbnails(result.items);
    }
    catch(error){
        alert("Something Wrong");
    }
}

// get views function

function getViews(n)
{
    if(n < 1000) return n;
    else if(n >= 1000 && n <= 999999){
        n /= 1000;
        n = parseInt(n);
        return n+"K";
    }
    return parseInt(n / 1000000) + "M"
}

function formattedData(n){
    if(!n) return "NA";
//   PT02H33M22S
    let hrs = n.slice(2,4);
    let mins = n.slice(5,7);
    let sec ;
    if(n.length > 8){
        sec = n.slice(8,10);
    }
    let str = `${hrs}:${mins}`;
    sec && (str +=  `${sec}`)
    return str;
}




function showThumbnails(items){
    for(let i=0; i<items.length; i++){
        let videoItem = items[i]; 
        let imageUrl = videoItem.snippet.thumbnails.high.url;
        let videoElement = document.createElement("div");
        videoElement.addEventListener("click", () =>{
            navigateToVideo(videoItem.id.videoId);
        });

       const videoChildren = `
       <img src = "${imageUrl}" />
       <b>${formattedData(videoItem.duration)}</b>
       <p class="title">${videoItem.snippet.title}</p>
       <p class="channelName">${videoItem.snippet.channelTitle}</>
       <p class="viewsCount">${videoItem.videoStats ? getViews(videoItem.videoStats.viewCount) + " Views": "NA"}</p>
       `;
       videoElement.innerHTML = videoChildren;
        
        videoContainer.append(videoElement);
    }
}


// video fetch api
async function fetchStats(videoId){
  const endPoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,contentDetails&id=${videoId}`;
  let response =  await fetch(endPoint);
  let result = await response.json();
  return result;
}

function navigateToVideo(videoId){
    // http://127.0.0.1:5500/video.html
    let path = "/video.html";
    document.cookie = `video_id=${videoId}; path=${path}`;

    if(videoId){
        let linkItem = document.createElement("a");
        linkItem.href = "./video.html";
        // linkItem.target = "_blank";
        linkItem.click();
    }else{
        alert("Go and Watch a video on youtube");
    }
}

// fetch channel logo
function ChannelLogo(videoId) {
    const endPoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${videoId}&key=${apiKey}`;
  
    fetch(endPoint)
      .then(response => response.json())
      .then(data => {
        const channelLogo = videoItem.items[0].snippet.thumbnails.default.url;
        console.log(channelLogo);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  