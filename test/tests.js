describe('Lyrics search', () => {
    beforeEach(() => {
        fixture.setBase('test');
        fixture.load('search.fixture.html');
        window.LyricSearchController.init();
    });

    afterEach(() => fixture.cleanup());

    it('should start with an empty search field', () => expect($('input').val()).toBe(''));
    it('should start with a disabled search button', () => expect($('#search-button').prop('disabled')).toBe(true));

    describe('search button', () => {
        let searchButton;
        let artist;
        let song;

        beforeEach(() => {
            searchButton = $('#search-button');
            artist = $('#artist-name');
            song = $('#song-name');
        });

        it('should be enabled when the search field is not blank', () => {
            artist.val('artist').trigger('input');
            song.val('song').trigger('input');
            expect(searchButton.prop('disabled')).toBe(false);
        });

        it('should be disabled when the search field is blank', () => {
            artist.val('').trigger('input');
            song.val('').trigger('input');
            expect(searchButton.prop('disabled')).toBe(true);
        });

        it('should trigger from enter key being pressed while in box', () => {
            spyOn(searchButton, 'click');
            artist.val('artist').trigger('input');
            song.val('song').trigger('input');
            artist.trigger({ type: 'keydown', which: 13, keyCode: 13 });
            expect($('#stupid').length).toBeGreaterThan(0);
            // For the love of all that is holy I cannot find a way to spy on jQuery events.
            // Therefore I have this terrible way of testing if the expected function was called
        });
    });

    // Due to the asynchronous call structure of GiphySearchController, for certain usages of our stubbed API, we need
    // to wait for the call chain to finish before we can make our assertions. _This approach is fragile_ but cannot
    // be helped given the structure of the code. Ideally, though, we should find a way to get a clear signal for when
    // responses are fully processed so that we aren’t waiting on some arbitrary timeout.
    const FETCH_COMPLETION_DELAY = 250;

    describe('API calls', () => {
        beforeAll(() => {
            sinon.stub(window.ApiService, 'searchLyrics');
            sinon.stub(window.ApiService, 'spotifySearch');
            sinon.stub(window.ApiService, 'spotifyRecommendations');
            sinon.stub(window.ApiService, 'youtubeSearch');

            // To manage size, we supply a mock response that contains _only_ what the app will need. This does mean
            // that we need to revise the mock response if our app starts using more (or different) data.
            window.ApiService.searchLyrics.returns(
                Promise.resolve({
                    result: {
                        artist: { name: 'Ween' },
                        track: {
                            name: 'OCEAN MAN',
                            text:
                                'Ocean man, take me by the hand, lead me to the land that you understand \nOcean man, the voyage to the \
                corner of the globe is a real trip \nOcean man, the crust of a tan man embibed by the sand \nSoaking up \
                the thirst of the land \n\nOcean man, can you see through the wonder of amazement at the oberman \nOcean \
                man, the crust is elusive when it casts forth to the childlike man \nOcean man, the sequence of a life form \
                braised in the sand,\nSoaking up the thirst of the land \n\nOcean man, ocean man \nOcean man \n\n[repeat \
                  verses] \n\nOcean man \n\n',
                            lang: {
                                code: 'en',
                                name: 'English',
                            },
                        },
                        copyright: {
                            notice:
                                'OCEAN MAN lyrics are property and copyright of their owners. Commercial use is not allowed.',
                            artist: 'Copyright Ween',
                            text:
                                'All lyrics provided for educational purposes and personal use only.',
                        },
                        probability: 100,
                        similarity: 1,
                    },
                }),
            );

            window.ApiService.spotifySearch.returns(
                Promise.resolve({
                    tracks: {
                        href:
                            'https://api.spotify.com/v1/search?query=track%3AOCEAN+MAN+artist%3AWeen&type=track&market=US&offs'
                            + 'et=0&limit=1',
                        items: [
                            {
                                album: {
                                    album_type: 'album',
                                    artists: [
                                        {
                                            external_urls: {
                                                spotify:
                                                    'https://open.spotify.com/artist/3u1ulLq00Y3bfmq9FfjsPu',
                                            },
                                            href:
                                                'https://api.spotify.com/v1/artists/3u1ulLq00Y3bfmq9FfjsPu',
                                            id: '3u1ulLq00Y3bfmq9FfjsPu',
                                            name: 'Ween',
                                            type: 'artist',
                                            uri:
                                                'spotify:artist:3u1ulLq00Y3bfmq9FfjsPu',
                                        },
                                    ],
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/album/1yfJqxKKXG320vhqLfUEeC',
                                    },
                                    href:
                                        'https://api.spotify.com/v1/albums/1yfJqxKKXG320vhqLfUEeC',
                                    id: '1yfJqxKKXG320vhqLfUEeC',
                                    images: [
                                        {
                                            height: 640,
                                            url:
                                                'https://i.scdn.co/image/ba1569338bcef61523f77c74d6f38b701b3266c7',
                                            width: 640,
                                        },
                                        {
                                            height: 300,
                                            url:
                                                'https://i.scdn.co/image/4a3fcbe20ab3af2fb0c6d678b52497d08d45844a',
                                            width: 300,
                                        },
                                        {
                                            height: 64,
                                            url:
                                                'https://i.scdn.co/image/41027f4ae3cea54fe3678f92e14febc33edb9a2b',
                                            width: 64,
                                        },
                                    ],
                                    name: 'The Mollusk',
                                    release_date: '1997-04-18',
                                    release_date_precision: 'day',
                                    total_tracks: 14,
                                    type: 'album',
                                    uri: 'spotify:album:1yfJqxKKXG320vhqLfUEeC',
                                },
                                artists: [
                                    {
                                        external_urls: {
                                            spotify:
                                                'https://open.spotify.com/artist/3u1ulLq00Y3bfmq9FfjsPu',
                                        },
                                        href:
                                            'https://api.spotify.com/v1/artists/3u1ulLq00Y3bfmq9FfjsPu',
                                        id: '3u1ulLq00Y3bfmq9FfjsPu',
                                        name: 'Ween',
                                        type: 'artist',
                                        uri:
                                            'spotify:artist:3u1ulLq00Y3bfmq9FfjsPu',
                                    },
                                ],
                                disc_number: 1,
                                duration_ms: 126946,
                                explicit: false,
                                external_ids: { isrc: 'USEE19701313' },
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/track/6M14BiCN00nOsba4JaYsHW',
                                },
                                href:
                                    'https://api.spotify.com/v1/tracks/6M14BiCN00nOsba4JaYsHW',
                                id: '6M14BiCN00nOsba4JaYsHW',
                                is_local: false,
                                is_playable: true,
                                name: 'Ocean Man',
                                popularity: 65,
                                preview_url:
                                    'https://p.scdn.co/mp3-preview/a34c1a880f5c688fd9282beafec42ab13ab9a07b?cid=5c8ab66476f'
                                    + 'c4a0fb1a489849348646b',
                                track_number: 13,
                                type: 'track',
                                uri: 'spotify:track:6M14BiCN00nOsba4JaYsHW',
                            },
                        ],
                        limit: 1,
                        next:
                            'https://api.spotify.com/v1/search?query=track%3AOCEAN+MAN+artist%3AWeen&type=track&market=US&offse'
                            + 't=1&limit=1',
                        offset: 0,
                        previous: null,
                        total: 3,
                    },
                }),
            );

            window.ApiService.spotifyRecommendations.returns(
                Promise.resolve({
                    tracks: [
                        {
                            album: {
                                album_type: 'ALBUM',
                                artists: [
                                    {
                                        external_urls: {
                                            spotify:
                                                'https://open.spotify.com/artist/3u1ulLq00Y3bfmq9FfjsPu',
                                        },
                                        href:
                                            'https://api.spotify.com/v1/artists/3u1ulLq00Y3bfmq9FfjsPu',
                                        id: '3u1ulLq00Y3bfmq9FfjsPu',
                                        name: 'Ween',
                                        type: 'artist',
                                        uri:
                                            'spotify:artist:3u1ulLq00Y3bfmq9FfjsPu',
                                    },
                                ],
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/album/6H5fUQk4FkT9iR4SNHnK3D',
                                },
                                href:
                                    'https://api.spotify.com/v1/albums/6H5fUQk4FkT9iR4SNHnK3D',
                                id: '6H5fUQk4FkT9iR4SNHnK3D',
                                images: [
                                    {
                                        height: 640,
                                        url:
                                            'https://i.scdn.co/image/3138592a50938d1ae316eb55a176f7b86d921eec',
                                        width: 640,
                                    },
                                    {
                                        height: 300,
                                        url:
                                            'https://i.scdn.co/image/5d38203c0bd9106c2b82e82e9717fd849a561d17',
                                        width: 300,
                                    },
                                    {
                                        height: 64,
                                        url:
                                            'https://i.scdn.co/image/2ee68bae2c5eab649afc2a93ebda33041b0ff273',
                                        width: 64,
                                    },
                                ],
                                name: '12 Golden Country Greats',
                                type: 'album',
                                uri: 'spotify:album:6H5fUQk4FkT9iR4SNHnK3D',
                            },
                            artists: [
                                {
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/artist/3u1ulLq00Y3bfmq9FfjsPu',
                                    },
                                    href:
                                        'https://api.spotify.com/v1/artists/3u1ulLq00Y3bfmq9FfjsPu',
                                    id: '3u1ulLq00Y3bfmq9FfjsPu',
                                    name: 'Ween',
                                    type: 'artist',
                                    uri:
                                        'spotify:artist:3u1ulLq00Y3bfmq9FfjsPu',
                                },
                            ],
                            disc_number: 1,
                            duration_ms: 242600,
                            explicit: false,
                            external_ids: { isrc: 'USEE19694764' },
                            external_urls: {
                                spotify:
                                    'https://open.spotify.com/track/1fxyunx4FdwnbCXjWl9RhQ',
                            },
                            href:
                                'https://api.spotify.com/v1/tracks/1fxyunx4FdwnbCXjWl9RhQ',
                            id: '1fxyunx4FdwnbCXjWl9RhQ',
                            is_playable: true,
                            name: "I'm Holding You",
                            popularity: 35,
                            preview_url:
                                'https://p.scdn.co/mp3-preview/5bc9be168da61d9d1796eded3cdf0c002bfd9801?cid=5c8ab66476fc4'
                                + 'a0fb1a489849348646b',
                            track_number: 1,
                            type: 'track',
                            uri: 'spotify:track:1fxyunx4FdwnbCXjWl9RhQ',
                        },
                        {
                            album: {
                                album_type: 'ALBUM',
                                artists: [
                                    {
                                        external_urls: {
                                            spotify:
                                                'https://open.spotify.com/artist/3QDaXfnxfQqqJQK5lSdjLN',
                                        },
                                        href:
                                            'https://api.spotify.com/v1/artists/3QDaXfnxfQqqJQK5lSdjLN',
                                        id: '3QDaXfnxfQqqJQK5lSdjLN',
                                        name: 'Jerry Garcia',
                                        type: 'artist',
                                        uri:
                                            'spotify:artist:3QDaXfnxfQqqJQK5lSdjLN',
                                    },
                                ],
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/album/3U0p9Fjv2QN72aL4hT1fwe',
                                },
                                href:
                                    'https://api.spotify.com/v1/albums/3U0p9Fjv2QN72aL4hT1fwe',
                                id: '3U0p9Fjv2QN72aL4hT1fwe',
                                images: [
                                    {
                                        height: 640,
                                        url:
                                            'https://i.scdn.co/image/1c9bc1e273b5d9213da6418b860c5887c419f43c',
                                        width: 640,
                                    },
                                    {
                                        height: 300,
                                        url:
                                            'https://i.scdn.co/image/180e47bbf379364bb244a25aeb7ed3ee7a62c329',
                                        width: 300,
                                    },
                                    {
                                        height: 64,
                                        url:
                                            'https://i.scdn.co/image/da592e9a7c3920bbd18a246cdc600bdefd7481bb',
                                        width: 64,
                                    },
                                ],
                                name: 'Run for the Roses (Expanded)',
                                type: 'album',
                                uri: 'spotify:album:3U0p9Fjv2QN72aL4hT1fwe',
                            },
                            artists: [
                                {
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/artist/3QDaXfnxfQqqJQK5lSdjLN',
                                    },
                                    href:
                                        'https://api.spotify.com/v1/artists/3QDaXfnxfQqqJQK5lSdjLN',
                                    id: '3QDaXfnxfQqqJQK5lSdjLN',
                                    name: 'Jerry Garcia',
                                    type: 'artist',
                                    uri:
                                        'spotify:artist:3QDaXfnxfQqqJQK5lSdjLN',
                                },
                            ],
                            disc_number: 1,
                            duration_ms: 179360,
                            explicit: false,
                            external_ids: { isrc: 'USRHD0430757' },
                            external_urls: {
                                spotify:
                                    'https://open.spotify.com/track/0zf9xqwYkkaBsg9we31bhi',
                            },
                            href:
                                'https://api.spotify.com/v1/tracks/0zf9xqwYkkaBsg9we31bhi',
                            id: '0zf9xqwYkkaBsg9we31bhi',
                            is_playable: true,
                            name: 'I Saw Her Standing There',
                            popularity: 35,
                            preview_url:
                                'https://p.scdn.co/mp3-preview/0cac211b6ec304b81f968ae5701d315236ebe203?cid=5c8ab66476fc4'
                                + 'a0fb1a489849348646b',
                            track_number: 2,
                            type: 'track',
                            uri: 'spotify:track:0zf9xqwYkkaBsg9we31bhi',
                        },
                        {
                            album: {
                                album_type: 'ALBUM',
                                artists: [
                                    {
                                        external_urls: {
                                            spotify:
                                                'https://open.spotify.com/artist/6ra4GIOgCZQZMOaUECftGN',
                                        },
                                        href:
                                            'https://api.spotify.com/v1/artists/6ra4GIOgCZQZMOaUECftGN',
                                        id: '6ra4GIOgCZQZMOaUECftGN',
                                        name: 'Frank Zappa',
                                        type: 'artist',
                                        uri:
                                            'spotify:artist:6ra4GIOgCZQZMOaUECftGN',
                                    },
                                    {
                                        external_urls: {
                                            spotify:
                                                'https://open.spotify.com/artist/3P2gYnypDVi90ZavnaAhfL',
                                        },
                                        href:
                                            'https://api.spotify.com/v1/artists/3P2gYnypDVi90ZavnaAhfL',
                                        id: '3P2gYnypDVi90ZavnaAhfL',
                                        name: 'The Mothers Of Invention',
                                        type: 'artist',
                                        uri:
                                            'spotify:artist:3P2gYnypDVi90ZavnaAhfL',
                                    },
                                ],
                                external_urls: {
                                    spotify:
                                        'https://open.spotify.com/album/6qfS5de8GAy1G5tk7tyiof',
                                },
                                href:
                                    'https://api.spotify.com/v1/albums/6qfS5de8GAy1G5tk7tyiof',
                                id: '6qfS5de8GAy1G5tk7tyiof',
                                images: [
                                    {
                                        height: 640,
                                        url:
                                            'https://i.scdn.co/image/bb7ca0bdc1bbffbe9e654ecad92468c82d18dfde',
                                        width: 640,
                                    },
                                    {
                                        height: 300,
                                        url:
                                            'https://i.scdn.co/image/be1177c62f2dcca8a74db1ad95721d4f307e391c',
                                        width: 300,
                                    },
                                    {
                                        height: 64,
                                        url:
                                            'https://i.scdn.co/image/576daa9b149516b81cdd3bc7696a21bcb5a43278',
                                        width: 64,
                                    },
                                ],
                                name: 'Freak Out!',
                                type: 'album',
                                uri: 'spotify:album:6qfS5de8GAy1G5tk7tyiof',
                            },
                            artists: [
                                {
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/artist/6ra4GIOgCZQZMOaUECftGN',
                                    },
                                    href:
                                        'https://api.spotify.com/v1/artists/6ra4GIOgCZQZMOaUECftGN',
                                    id: '6ra4GIOgCZQZMOaUECftGN',
                                    name: 'Frank Zappa',
                                    type: 'artist',
                                    uri:
                                        'spotify:artist:6ra4GIOgCZQZMOaUECftGN',
                                },
                                {
                                    external_urls: {
                                        spotify:
                                            'https://open.spotify.com/artist/3P2gYnypDVi90ZavnaAhfL',
                                    },
                                    href:
                                        'https://api.spotify.com/v1/artists/3P2gYnypDVi90ZavnaAhfL',
                                    id: '3P2gYnypDVi90ZavnaAhfL',
                                    name: 'The Mothers Of Invention',
                                    type: 'artist',
                                    uri:
                                        'spotify:artist:3P2gYnypDVi90ZavnaAhfL',
                                },
                            ],
                            disc_number: 1,
                            duration_ms: 350053,
                            explicit: false,
                            external_ids: { isrc: 'USZPE1200012' },
                            external_urls: {
                                spotify:
                                    'https://open.spotify.com/track/2j25bv2cpByJLaNZRKEBwR',
                            },
                            href:
                                'https://api.spotify.com/v1/tracks/2j25bv2cpByJLaNZRKEBwR',
                            id: '2j25bv2cpByJLaNZRKEBwR',
                            is_playable: true,
                            name: 'Trouble Every Day',
                            popularity: 40,
                            preview_url: null,
                            track_number: 12,
                            type: 'track',
                            uri: 'spotify:track:2j25bv2cpByJLaNZRKEBwR',
                        },
                    ],
                    seeds: [
                        {
                            initialPoolSize: 250,
                            afterFilteringSize: 250,
                            afterRelinkingSize: 250,
                            id: '3u1ulLq00Y3bfmq9FfjsPu',
                            type: 'ARTIST',
                            href:
                                'https://api.spotify.com/v1/artists/3u1ulLq00Y3bfmq9FfjsPu',
                        },
                        {
                            initialPoolSize: 250,
                            afterFilteringSize: 250,
                            afterRelinkingSize: 249,
                            id: '6M14BiCN00nOsba4JaYsHW',
                            type: 'TRACK',
                            href:
                                'https://api.spotify.com/v1/tracks/6M14BiCN00nOsba4JaYsHW',
                        },
                    ],
                }),
            );

            window.ApiService.youtubeSearch.returns(
                Promise.resolve({
                    kind: 'youtube#searchListResponse',
                    etag:
                        '"XI7nbFXulYBIpL0ayR_gDh3eu1k/taChDdn7lbAH9fFy9wEEQT8b-NA"',
                    nextPageToken: 'CAEQAA',
                    regionCode: 'US',
                    pageInfo: {
                        totalResults: 66025,
                        resultsPerPage: 1,
                    },
                    items: [
                        {
                            kind: 'youtube#searchResult',
                            etag:
                                '"XI7nbFXulYBIpL0ayR_gDh3eu1k/UgGDn1og4J4QAzHDi7Ml27atB4c"',
                            id: {
                                kind: 'youtube#video',
                                videoId: 'cs926AIL-ck',
                            },
                            snippet: {
                                publishedAt: '2010-10-18T03:29:08.000Z',
                                channelId: 'UCrQLFSoRVZRfa3FfAxAYhCQ',
                                title: 'Ween - Ocean Man',
                                description: 'From "The Mollusk"',
                                thumbnails: {
                                    default: {
                                        url:
                                            'https://i.ytimg.com/vi/cs926AIL-ck/default.jpg',
                                        width: 120,
                                        height: 90,
                                    },
                                    medium: {
                                        url:
                                            'https://i.ytimg.com/vi/cs926AIL-ck/mqdefault.jpg',
                                        width: 320,
                                        height: 180,
                                    },
                                    high: {
                                        url:
                                            'https://i.ytimg.com/vi/cs926AIL-ck/hqdefault.jpg',
                                        width: 480,
                                        height: 360,
                                    },
                                },
                                channelTitle: 'PaulTheHeretic',
                                liveBroadcastContent: 'none',
                            },
                        },
                    ],
                }),
            );
        });

        afterAll(() => {
            window.ApiService.spotifyRecommendations.restore();
            window.ApiService.spotifySearch.restore();
            window.ApiService.searchLyrics.restore();
            window.ApiService.youtubeSearch.restore();
        });

        beforeEach(() => {
            $('#artist-name').val('testArtist');
            $('#song-name')
                .val('testSong')
                .trigger('input');
            $('#search-button').click();
        });

        it('should trigger a Lyrics search when the search button is clicked', () => expect(
            window.ApiService.searchLyrics.calledWith(
                $('artist-name').val(),
                $('song-name').val(),
            ),
        ));

        it('should populate the lyric container when search results arrive', done => setTimeout(() => {
            expect($('#lyrics-body').text().length).toBeGreaterThan(0);
            done();
        }, FETCH_COMPLETION_DELAY));

        it('should populate the header container when search results arrive', done => setTimeout(() => {
            expect($('#track-info').children().length).toBe(2);
            done();
        }, FETCH_COMPLETION_DELAY));

        it('should should display album art from spotify', done => setTimeout(() => {
            expect(
                $('#album-art')
                    .find($('img'))
                    .attr('src'),
            ).toBe(
                'https://i.scdn.co/image/4a3fcbe20ab3af2fb0c6d678b52497d08d45844a',
            );
            done();
        }, FETCH_COMPLETION_DELAY));

        it('should display recommendations', done => setTimeout(() => {
            expect($('#recommendations').children().length).toBe(4);
            done();
        }, FETCH_COMPLETION_DELAY));

        it('should load new search upon clicking recommendation', done => setTimeout(() => {
            $('#rec0').click();
            expect($('#artist-name').val()).toBe('Ween');
            expect($('#song-name').val()).toBe("I'm Holding You");
            done();
        }, FETCH_COMPLETION_DELAY));
    });

    describe('failed API calls', () => {
        beforeEach(() => {
            sinon.stub(window.ApiService, 'searchLyrics');
            window.ApiService.searchLyrics.returns(
                Promise.reject('Mock failure'),
            );

            $('#artist-name').val('hello failure');
            $('#song-name').val('my old friend');
            $('#search-button').click();
        });

        afterEach(() => {
            window.ApiService.searchLyrics.restore();
        });

        it('should display an alert when the API call fails', done => setTimeout(() => {
            // In this test, we have chosen not to a specific message; we’re just making sure that an alert-danger
            // element showed up. Of course, we _may_ choose to expect a particular message, especially if we want
            // it to say something specific to the user.
            expect($('#main-col').find('.alert.alert-danger').length).toBe(
                2,
            );
            done();
        }, FETCH_COMPLETION_DELAY));
    });

    describe('uncertain API results', () => {
        const FETCH_COMPLETION_DELAY = 250;

        beforeEach(() => {
            sinon.stub(window.ApiService, 'searchLyrics');
            window.ApiService.searchLyrics.returns(
                Promise.resolve({
                    result: {
                        artist: { name: 'Ween' },
                        track: {
                            name: 'OCEAN MAN',
                            text:
                                'Ocean man, take me by the hand, lead me to the land that you understand \nOcean man, the voyage to the \
                corner of the globe is a real trip \nOcean man, the crust of a tan man embibed by the sand \nSoaking up \
                the thirst of the land \n\nOcean man, can you see through the wonder of amazement at the oberman \nOcean \
                man, the crust is elusive when it casts forth to the childlike man \nOcean man, the sequence of a life form \
                braised in the sand,\nSoaking up the thirst of the land \n\nOcean man, ocean man \nOcean man \n\n[repeat \
                  verses] \n\nOcean man \n\n',
                            lang: {
                                code: 'en',
                                name: 'English',
                            },
                        },
                        copyright: {
                            notice:
                                'OCEAN MAN lyrics are property and copyright of their owners. Commercial use is not allowed.',
                            artist: 'Copyright Ween',
                            text:
                                'All lyrics provided for educational purposes and personal use only.',
                        },
                        probability: 30,
                        similarity: 1,
                    },
                }),
            );
            $('#artist-name').val('hello failure');
            $('#song-name').val('my old friend');
            $('#search-button').click();
        });

        afterEach(() => window.ApiService.searchLyrics.restore());

        it('should display a warning', done => setTimeout(() => {
            // In this test, we have chosen not to a specific message; we’re just making sure that an alert-danger
            // element showed up. Of course, we _may_ choose to expect a particular message, especially if we want
            // it to say something specific to the user.
            expect($('#main-col').find('.alert-warning').length).toBe(2);
            done();
        }, FETCH_COMPLETION_DELAY));
    });
});
