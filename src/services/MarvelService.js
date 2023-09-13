import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=63211788ea72eed8cacf03632c6a39cd';
    const _baseOffset = 210;

    const {loading, request, error, clearError, process, setProcess} = useHttp();


    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByNameInput =  async (name) => {
        const res =  await request(`${_apiBase}characters?nameStartsWith=${name}&orderBy=name&${_apiKey}`);
        return  res.data.results.map(item => _transformCharacter(item));
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const _transformCharacter = (char) => {
        let description = 'Нет данных по персонажу';

        if (char.description.length !== 0) {
            description = char.description;
        }

        if (description.length > 175) {
            description = description.slice(0, 175) + '...'
        }
        console.log(char.urls[0].url)
        return {
            id: char.id,
            name: char.name,
            description: description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    };

    return {
        loading,
        error,
        clearError,
        process,
        setProcess,
        getAllCharacters,
        getCharacterByName,
        getCharacterByNameInput,
        getCharacter,
        getAllComics,
        getComic
    };
}

export default useMarvelService;