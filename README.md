# Lyrics Search Web App
*this is a clone from the github classroom repo this was originally created on*

## Introduction

My web app, creatively named Lyrics Search, made use of three APIs to provide lyrics to a song as well as links to listen to it on Spotify or YouTube. The primary API, [APISeeds Lyrics API](https://apiseeds.com/documentation/lyrics), took in an artist and song name, provided by the user, and returned the Lyrics and basic metadata (song name, artist name, album name, etc.). If the lyrics were found, it then passed the same artist and song to the [Spotify API](https://developer.spotify.com/documentation/web-api/), which in turn provided 3 functions to my app. First, it populated a button with a link that opened the song in Spotify's web player. Second, it returned recommendations for similar songs based on the track that was searched. Finally, it provided an album art image that was displayed next to the header containing song info. The [YouTube API's](https://developers.google.com/youtube/v3/docs/search/list) only function was to populate a button with a link to the top result for the song on YouTube, similar to Spotify.

## Evaluation

### Heuristic Evaluation

The core design focuses of my website were simplicity, intuitiveness, and efficiency. While developing the front-end, I wanted to ensure there was a minimal number of elements to confuse or distract the user. As such, I opted for a navbar containing two, clearly labeled input boxes with a single search button. Since these input elements were in the top left of the page, I added a large text block front and center instructing the user how to use the site.

I had originally planned to implement some of Google's Material UI design guidelines, but as I started to work, realized that the difficulty added by using material design libraries (such as for [bootstrap](https://fezvrasta.github.io/bootstrap-material-design/) or [react](https://reactstrap.github.io/)) would cause too much extra work. Since I was already unfamiliar with web development, adding more things to learn and have issues which turned me off from using such libraries. Ultimately, the only official guideline I used from Material Design was [the color schemes](https://material.io/design/color/the-color-system.html#tools-for-picking-colors), since they helped me pick an aesthetically pleasing color palette for a dark theme.

Another important guideline I followed was the brand guidelines from [YouTube](https://www.youtube.com/yt/about/brand-resources/#logos-icons-colors) and [Spotify](https://developer.spotify.com/branding-guidelines/). These companies were exceptionally strict with how their brand logos/icons could be used, even going so far as to what backgrounds they could be placed on. To conform to their guidelines, I used the images provided by the companies directly from their guidelines page and used the exact colors they specified for their brand. I am confident that my use of their brand icons follows their guidelines completely.

As a small note, the icon (featured in the top left of page and as the favicon), was a free use icon found [here](https://www.iconfinder.com/icons/531899/entertainment_mic_microphone_multimedia_music_sound_icon). The icon featured clean, flat art that related to lyrics, so I deemed it fitting for the project.

With Fit'z law in mind, all interactable elements on the page are grouped together, placed in logical locations (corners, center, aligned), and adequately sized to be easily clickable.

### Usability Metrics

- Satisfaction:

  - Michael Simmons: 9
  - Nikki Rajavasireddy: 9
  - Mike West: 8

- Error:
  - Michael: attempted to search for a song without providing the artist, not realizing that both were required.
  - Nikki: Tried to search for a song that wasn't found by the API.
  - Mike: no errors

The measurements observed here line up with my expectations for my front-end. The two errors experienced by users were exactly the issues that I had foreseen while designing it. My original design featured a single text input field that could parse both the artist and song; unfortunately, this was not feasible for the API I was using.

My original metric forecast predicted that errors would be biggest issue due to confusion about the single search box being comma-separated, but this design ended up being changed in the implementation. Having two separate boxes seemed less prone to error than comma-separated values for a few reasons. First, clear instructions on the formatting of inputs as `[artist, song]`, would reduce the intuition and memorability of the interface. Having two separate, clearly labeled inputs, while not ideal, is much more obvious in how to use it. My primary mistake was not clearly indicating that BOTH input fields are required, since the button is simply disabled when at least one field is empty. A better approach would have been to add a separate onclick function to the button for when only one box has been filled, displaying a warning message to the user that they must fill both fields before searching.

User satisfaction with the application was about what I had expected and hoped for. Apart from songs that are not in the API's database, the application does exactly what it is intended to do: find lyrics. If a user comes to the site for that purpose, they should get exactly what they wanted.

### Recap

Overall my front end appears to be fairly usable, largely in part to the simplicity of its function and interface. Although the application has several functions, the primary goal of finding lyrics for an input song is extremely easy due to the dynamic layout of the site. When first loaded the user is shown simple, impossible to miss instructions on what to do. At this point, the only elements they can interact with are the input fields and search button; additionally, the search button is disabled, only becoming enabled (and changing colors to "light up") when both text fields have entries in them.

Once their query has been made, the instructions are replaced with a loading indicator signifying their input has been registered and is being processed. At this point, if a result was found, the page will populate with the lyrics, song info + album art, "Play on" buttons for Spotify and YouTube, and recommendations. All but one of these new elements are self-evident in their function and presentation. The outlier is the recommendations section, which does not signal to users that they also have an on-click function. No one had the intuition to try to interact with the recommendations, and for good reason.

The recommendation feature, while not clear to the user, is only a bonus feature to the sites functionality. The intention of the site is first and foremost to provide lyrics for a queried song. Since this feature and the "play on" feature are not hindered by recommendations, I would not say that it significantly detracts from the usability of my application. A new user coming to the site should find no troubles learning what the site's function is, how to use it, or why they got the results they did.

## Design Vision

I was generally satisfied with my current implementation of my front end, however there are certainly aspects I would change in its ideal form. The primary change would be a full implementation of material design, beyond even what my original idea had suggested. Having gone through the actual process of designing and creating a front end for this application, I have a much clearer view of how the Material Design guidelines could be implemented in my front end.

I meticulously organized the bootstrap grid of my elements in a way that clearly separated and organized every element in a logical and scalable way. The issue is that these "objects" of grouped elements are only truly visible in the code, not the user interface. Utilizing the [shape](https://material.io/design/shape/about-shape.html#) concepts from Material Design could allow for distinct elements on the page to be visible to the user. Commonly referred to as "cards", these shapes are designed in a way that they visibly appear as objects on the "table" that is the background.

Another feature from my initial design that I was unable to implement was the single "uni-search-bar" that accepts both the artist and song, without requiring the user to type into separate boxes. The difficulty arose from the fact that the lyrics API I choose required its queries to be in the format `(artist, song)`. The only feasible solution I could come up with was to separate them with commas, but decided that requiring so would lead to a massive increase in errors. Nonetheless, an ideal front end would have some form of natural language processing, allowing it to understand what part of the input was the artist and what part was the song.

Aside from the unified search bar, there are no other features I would add to my front end. I designed this application as a website that I would personally like to use, and I lean heavily towards minimalism and separation of concerns. In fact, I favor simple design so much that I would likely remove the recommendation feature in the future version since I find them to only add clutter that I do not care about. When I envision a user opening the site, I see them typing in a song and getting the lyrics, nothing more, nothing less.

### Top-Level Design/Layout

Many of the design choices here are [explained above in my design vision](#design-vision), since the new vision is based entirely on design changes, not functional changes.

In short: Aside from the navbar, all elements on the page are grouped together within simple white cards against an off-white background ([commonly seen in material design pages](https://material.io/design/color/the-color-system.html#color-theme-creation)). Once again simplicity and clear separation of concerns is fundamental to this design.

Example page using new layout:

![alt text](/IMG-0107.png 'front end sketch')

\* I realized only too late that I wrote "sixed" instead of "sized" the bottom right box. This was made in an online image editor, so I couldn't simply edit the text without redoing the whole thing. RIP.

### Usage Scenarios

#### Finding a song's lyrics

The primary and essential function of the site. Upon first loading the page, users will see the navbar as depicted in the [above mock-up](#top-level-designlayout), but with all the cards replaced by single card with the text "Search for a song's lyrics above" (much like the current model, just visually different). The user will then enter a artist and song into the search bar, then either hit "enter" or click the search button to start their query. A loading indicator then replaces the instructional card, signifying the query is being processed. If a song was found, the 3 cards seen above will appear with the content (lyrics, art, metadata) of the found song. In the event an invalid query is made or the song is not in the database, a single red error card will show up stating "no results found for `[query]`".

#### Playing a song once found

By necessity takes place after the above ["finding a song's lyrics"](#finding-a-songs-lyrics) event.

At this point, the user will likely at least skim over the card (again seen in [mock-up](#top-level-designlayout)) containing links to play the song at different streaming services (if found). If they so wish to play it, clicking the button, colored and branded with streaming service's logo, will open a new page and begin playing the song. I have lefts parts of my rational scattered throughout this write-up, but I will attempt to consolidate them here.

### Design Rationale

I have lefts parts of my rational scattered throughout this write-up, but I will attempt to consolodate them here.

The priorities of this design are simple, clean, easy to learn and use. The site has one primary function (find song lyrics), and the front-end should make clear to the user what this function is and how to carry it out the first time they load the site. Following this idea, a standard web app is the perfect fit for this application. The power of a framework like React is entirely unnecessary here and would only slow load times and increase network resources. Additionally, a mobile application involves being tied to a platform’s app store, and users must download the app themselves. Considering how light the project's resources are, a web app with responsive design allows for universal access with a single experience across all devices.

As mentioned a few times, the Material Design guidelines have always been ideal in my vision for the project. In particular, the [responsive layout grid](https://material.io/design/layout/responsive-layout-grid.html#columns-gutters-margins), [color system](https://material.io/design/color/the-color-system.html#tools-for-picking-colors), and [shape](https://material.io/design/shape/about-shape.html#) guidelines. Combining these idea together can create a very intuitive interface that signifies ([Norman pg 13](#references)) the functions of the design clearly. Simulating layers and shapes creates an intuitive user system image ([Norman pg 31](#references)) that simulates the familiar style of dealing with distinct, physical objects on a table. Rather than relying on extensive text based documentation and instructions, the model of the application reveals its self naturally through its appearance.

The following section came from my original design, but still stands in the new vision:

> Don Norman mentions the concept of "mapping" in his book "Design of Everyday Things", which refers to the connection between two elements in a design. In this case, having the input box element directly touching the "enter/search" button is an extremely common connection that anyone who has used the internet is familiar with. The implication that the button instructs the application to process the user's input should be obvious to all users.
>
> Later in his book, Norman discusses 'Feedback' as a crucial factor of communicating what is happening to the user. This webpage will update in real time, rather than loading a new page. Once information is retrieved from the API's, the lower portion of the page will occupy with the lyrics and song info. Since this will likely take a few seconds to retrieve the data, I will add an element to the page indicating the program is working in the background while the API works. This will indicate to users that their action was registered, and the program is functioning as intended

### Usability Metric Motivation

The changes in the new vision are based around improving "subjectively pleasing" and reducing errors, the two metrics I measured. Each change made is twofold in its improvements; by creating a more subjectively pleasing design (utilizing material design), the interface also becomes easier to understand. Unifying the search inputs and organizing all page elements into cards decreases confusion users could have about where something should be on the page. The artist and song inputs can no longer accidently be reversed, nor will the issue of being unable to click the button with only one field filled occur any more. The removal of the recommendations section ensures that users never accidently click an entry and unexpectedly see their query and results change. At the same time, this removal reduces clutter and makes more central the lyrics and "play on" buttons.

These changes do not have any foreseeable impact on the other usability metrics either. If anything, "efficiency to use" is increased by not having to move between input boxes. "Easy to remember" and "easy to learn" don't see any negative impacts either, as no new aspects that require learning or memorization are added.

The changes in the new vision are relatively minor since I was mostly pleased with the results of the current implementation. Using the new ideas presented here, improving on the applications strengths without creating any new weaknesses seems realistic.

## References

[1]“About shape,” Material Design. [Online]. Available: https://material.io/design/shape/about-shape.html#.

[2]F. Z. and B. contributors, “Bootstrap Material Design.” [Online]. Available: https://fezvrasta.github.io.

[3]“Brand Resources - YouTube.” [Online]. Available: https://www.youtube.com/yt/about/brand-resources/#logos-icons-colors.

[4]“Branding Guidelines | Spotify for Developers.” [Online]. Available: https://developer.spotify.com/branding-guidelines/. [Accessed: 07-Dec-2018].

[5]“Lyrics | Apiseeds.” [Online]. Available: https://apiseeds.com/documentation/lyrics.

[6]“reactstrap - React Bootstrap 4 components.” [Online]. Available: https://reactstrap.github.io/.

[7]“Responsive layout grid,” Material Design. [Online]. Available: https://material.io/design/layout/responsive-layout-grid.html#columns-gutters-margins.

[8]“Search: list | YouTube Data API,” Google Developers. [Online]. Available: https://developers.google.com/youtube/v3/docs/search/list.

[9]Eezy, “‘Technology Devices’ by Eezy,” Iconfinder. [Online]. Available: https://www.iconfinder.com/icons/531899/entertainment_mic_microphone_multimedia_music_sound_icon.

[10]“The color system,” Material Design. [Online]. Available: https://material.io/design/color/the-color-system.html#tools-for-picking-colors.

[11]D. A. Norman, The design of everyday things, Revised and expanded edition. New York, New York: Basic Books, 2013.

[12]“Web API | Spotify for Developers.” [Online]. Available: https://developer.spotify.com/documentation/web-api/.
