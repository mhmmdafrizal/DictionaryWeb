"use client";

import { useState } from 'react';
import Image from 'next/image';
import logo from "../../public/images/logo.svg";
import search from "../../public/images/icon-search.svg";
import linkIcon from "../../public/images/icon-new-window.svg";
import audioPlay from "../../public/images/icon-play.svg";
import DropdownArrow from '@/components/dropdownArrow';
import Link from 'next/link';
import ModeToggle from '@/components/ModeToggle';
import EmptyMode from '@/components/emptyMode';
import z from 'zod';
import NotFound from '@/components/notFound';

export default function Home() {
  const [ showDropdown, setShowDropdown ] = useState<boolean>( false );
  const [ font, setFont ] = useState<string>( 'Mono' );
  const [ bodyFont, setBodyFont ] = useState<string>( 'font-inconsolata' )
  const [ inputValue, setInputValue ] = useState<Data[]>( [] )
  const [ searchState, setSearchState ] = useState<string>( '' )
  const [ err, setErr ] = useState<string>( '' )
  const [ inputState, setInputState ] = useState<string>( 'outline-none' )
  const [ notFound, setNotFound ] = useState<boolean>( false )
  const [ bahasa, setBahasa ] = useState<string>( '' )
  const [ bahasaLoading, setBahasaLoading ] = useState<boolean>( false )

  // Typescript Interface
  interface Data {
    word: string,
    phonetic?: string,
    phonetics: {
      text?: string,
      audio?: string
    }[],
    meanings: {
      partOfSpeech: string,
      definitions: {
        definition: string,
        synonyms?: string[],
        antonyms?: string[],
        example?: string
      }[],
      synonyms?: string[],
      antonyms?: string[]
    }[],
    sourceUrls: string[]
  }
  // Zod Schema
  const DataSchema = z.array( z.object( {
    word: z.string(),
    phonetic: z.string().optional(),
    phonetics: z.array( z.object( {
      text: z.string().optional(),
      audio: z.string().optional()
    } ) ),
    meanings: z.array( z.object( {
      partOfSpeech: z.string(),
      definitions: z.array( z.object( {
        definition: z.string(),
        synonyms: z.array( z.string() ).optional(),
        antonyms: z.array( z.string() ).optional(),
        example: z.string().optional()
      } ) ),
      synonyms: z.array( z.string() ).optional(),
      antonyms: z.array( z.string() ).optional()
    } ) ),
    sourceUrls: z.array( z.string() )
  } ) )

  const dropdownHandler = (): void => {
    if ( showDropdown ) {
      setShowDropdown( !showDropdown );
    } else {
      setShowDropdown( !showDropdown );
    }
  }

  const fontHandler = ( font: string ): void => {
    if ( font === 'Sans Serif' ) {
      setFont( 'Sans Serif' );
      setBodyFont( 'font-inter' )
    } else if ( font === 'Serif' ) {
      setFont( 'Serif' );
      setBodyFont( 'font-lora' )
    } else {
      setFont( 'Mono' );
      setBodyFont( 'font-inconsolata' )
    }
    setShowDropdown( !showDropdown );
  }


  const fetchHandler = async ( evt: string ): Promise<void> => {
    if ( evt === '' ) {
      setInputState( 'outline outline-cred outline-2' )
      setErr( "Whoops, can't be empty..." )
      setInputValue( [] )
      setNotFound( false );
      setBahasa( '' )
      setBahasaLoading( false )

    } else {
      setInputState( 'outline-none' )
      evt = evt.toLowerCase().trim();
      setBahasa( '' )
      setBahasaLoading( false )
      let api: Response
      try {
        api = await fetch( `https://freedictionaryapi.com/api/v1/entries/en/${ evt }` );
      } catch {
        setErr( 'Failed to fetch. Check your connection and try again.' )
        setInputValue( [] )
        setNotFound( true )
        return
      }

      if ( searchState && api.status === 200 ) {
        setNotFound( false );
        const response = api
        interface Sense { definition: string; examples?: string[]; synonyms?: string[]; antonyms?: string[] }
        interface Entry { partOfSpeech: string; pronunciations?: { text?: string }[]; senses: Sense[]; synonyms?: string[]; antonyms?: string[] }
        const data: { word: string; entries: Entry[]; source?: { url?: string } } = await response.json();

        const transformed: Data[] = [ {
          word: data.word,
          phonetic: data.entries[ 0 ]?.pronunciations?.[ 0 ]?.text,
          phonetics: [],
          meanings: data.entries.map( ( entry ) => ( {
            partOfSpeech: entry.partOfSpeech,
            definitions: entry.senses.map( ( sense ) => ( {
              definition: sense.definition,
              synonyms: sense.synonyms?.length ? sense.synonyms : undefined,
              antonyms: sense.antonyms?.length ? sense.antonyms : undefined,
              example: sense.examples?.[ 0 ]
            } ) ),
            synonyms: entry.synonyms?.length ? entry.synonyms : undefined,
            antonyms: entry.antonyms?.length ? entry.antonyms : undefined
          } ) ),
          sourceUrls: data.source?.url ? [ data.source.url ] : []
        } ];

        // Zod validation
        const validatedData = DataSchema.safeParse( transformed );
        if ( !validatedData.success ) {
          console.error( 'Error validating data:', validatedData.error.message );
          return
        }
        setInputValue( transformed );
        setErr( '' )
      } else {
        setErr( '' )
        setInputValue( [] );
        setNotFound( true );

      }
    }
  }

  const translateHandler = async ( word: string ): Promise<void> => {
    if ( !word ) return;
    setBahasaLoading( true );
    try {
      const res = await fetch( `https://api.mymemory.translated.net/get?q=${ encodeURIComponent( word ) }&langpair=en|id` );
      const data = await res.json();
      setBahasa( data?.responseData?.translatedText ?? '' );
    } catch {
      setBahasa( '' );
    } finally {
      setBahasaLoading( false );
    }
  }


  return (
    <div className={ `sm:flex sm:items-center ${ bodyFont }  sm:flex-col p-6 min-h-screen dark:bg-dark4 bg-cwhite` }>
      <header className="flex items-center justify-between  mb-6 max-w-size w-full sm:mb-12">
        <Image className="shrink-0 w-7 h-8 sm:w-8 sm:h-9" src={ logo } alt="" width={ 22 } height={ 22 } />
        <nav className="flex items-center gap-1 sm:gap-4 w-[15rem] sm:w-[19rem] ">
          {/* <!-- font selection --> */ }

          <div className="w-2/4 text-end relative ">
            {/* <button onClick={ dropdownHandler }
              className="text-dark2 bg-transparent focus:outline-none focus:ring-0 font-bold rounded-lg text-sm sm:text-lg px-2 py-2 text-center inline-flex items-center dark:hover:bg-transparent dark:focus:ring-0 dark:text-cwhite"
              type="button">{ font }
              <DropdownArrow className=" w-2.5 h-2.5 ms-3 stroke-cpurple" />
            </button> */}

            {/* <!-- Dropdown menu --> */ }
            {/* <div> </div> */ }
            <div className={ `z-10 ${ showDropdown ? 'block' : 'hidden' } divide-y divide-gray-100 rounded-lg shadow-md shadow-gray1 absolute
          -left-1/3 sm:-left-2/3 w-44 text-start dark:shadow-cpurple `}>
              <ul className="py-2 text-sm text-dark2 sm:text-lg bg-cwhite dark:text-cwhite dark:bg-dark4 rounded-lg"
                aria-labelledby="dropdownDefaultButton">
                <li className="block px-4 py-2  dark:hover:text-cpurple cursor-pointer" onClick={ e => { fontHandler( e.currentTarget.innerText ) } }>Sans Serif
                </li>
                <li className="block px-4 py-2  dark:hover:text-cpurple cursor-pointer" onClick={ e => { fontHandler( e.currentTarget.innerText ) } }>
                  Serif
                </li>
                <li className="block px-4 py-2  dark:hover:text-cpurple cursor-pointer" onClick={ e => { fontHandler( e.currentTarget.innerText ) } }>Mono
                </li>

              </ul>
            </div>

          </div>
          <div
            className=" w-2/4 flex items-center gap-4 justify-end border-l border-solid ml-4 border-gray-3 dark:border-gray2">

            <ModeToggle />
          </div>
        </nav>
      </header>
      <main className="pb-20 max-w-size w-full">
        <section className='mb-6 sm:mb-12'>

          <div className="w-full flex relative rounded-xl  hover:border-cpurple cursor-pointer">

            <input type="text"
              className={ `w-full py-3.5 sm:py-5 pl-6 pr-12 bg-gray1 text-dark2 font-bold text-base sm:text-xl rounded-xl cursor-pointer ${ inputState } hover:ring-cpurple hover:ring-2  focus:ring-inset focus:ring-2 focus:ring-cpurple 
            placeholder:text-dark2 placeholder:text-base sm:placeholder:text-xl dark:bg-dark3 dark:text-cwhite dark:placeholder:text-cwhite`} onChange={ e => setSearchState( e.target.value.trim() ) } onKeyDown={ ( e ) => { if ( e.key === 'Enter' ) fetchHandler( searchState ) } }
              placeholder="Search" />
            <Image src={ search } role='button' alt=""
              className="absolute shrink-0 top-4 sm:top-6 right-4 sm:right-5 sm:w-6 sm:h-6" id="searchBtn" onClick={ () => fetchHandler( searchState ) } />
          </div>
          <p className='text-cred font-inherit text-lg sm:text-xl'>{ err }</p>
        </section>
        {/* Handle Empty state */ }
        { inputValue.length === 0 && !notFound && (
          <EmptyMode />
        ) }

        {/* Handle Not Found state */ }
        { notFound && (
          <NotFound />
        ) }

        {/* Display the search results */ }
        {
          inputValue.map( ( output: Data, j: number ) => (
            <div key={ j }>
              <section className="mb-8">
                {/* <!-- heading display --> */ }
                { ( j > 0 ) ? null : (
                  <div className="mb-8 sm:mb-12 flex justify-between items-center">
                    <div id="wordSection">
                      <h1 className="mb-2 text-[2rem] sm:text-[4rem] font-bold tracking-tight text-dark2 dark:text-cwhite">{ output.word }
                      </h1>
                      <p className="text-lg sm:text-2xl font-normal font-inter text-cpurple">{ output.phonetic }</p>
                      <div>
                        { bahasa && bahasa !== output.word && (
                          <p className="mt-2 text-base sm:text-xl font-normal text-emerald-600 dark:text-emerald-400">
                            Bahasa: { bahasa }
                          </p>
                        ) }
                        { bahasaLoading ? (
                          <p className="mt-2 text-sm text-gray3">Translating...</p>
                        ) : ( !bahasa && (
                          <button
                            type="button"
                            onClick={ () => translateHandler( output.word ) }
                            className="mt-3 text-sm font-bold text-cpurple underline hover:opacity-80">
                            Translate to Bahasa
                          </button>
                        ) ) }
                      </div>

                    </div>

                    <div className=" w-12 h-12 sm:w-[4.688rem] sm:h-[4.688rem]" id="audioPlayer">
                      <button
                        type="button"
                        className="w-full h-full shrink-0"
                        aria-label={ `Play pronunciation of ${ output.word }` }
                        onClick={ () => {
                          const utterance = new SpeechSynthesisUtterance( output.word );
                          utterance.lang = 'en-US';
                          speechSynthesis.cancel();
                          speechSynthesis.speak( utterance );
                        } }>
                        <Image src={ audioPlay } className="w-full h-full shrink-0" alt="audio play" />
                      </button>
                    </div>
                  </div>
                ) }
                {/* <!-- //////////////////////////// -->
        <!-- definition display --> */}
                <div id="holder">
                  <div>
                    {
                      output.meanings.map( ( meaning, i ) => (
                        <div key={ i }>

                          <div className="flex justify-center items-center gap-2.5 mb-8 sm:mb-11 text-dark2 dark:text-cwhite ">
                            <h2 className="w-fit font-bold text-lg sm:text-2xl italic">{ meaning.partOfSpeech }</h2>
                            <div className="border-b w-full border-gray2 dark:border-dark1"></div>
                          </div>
                          <div className="mb-6 sm:mb-10">
                            <h3 className="text-gray3 text-base sm:text-xl mb-4 sm:mb-7">Meaning</h3>
                            <ul className="list-disc list-outside text-base sm:text-lg ml-5 dark:text-cwhite ">
                              { meaning.definitions.map( ( def, x ) => (
                                <div key={ x }>
                                  <li className="mb-3.5">
                                    { def.definition }
                                  </li>
                                  { def.example && (
                                    <p className="text-gray3 mb-3">{ '"' + def?.example + '"' }</p>
                                  ) }
                                </div>
                              ) ) }
                            </ul>
                          </div>
                          { meaning.synonyms && meaning.synonyms.length > 0 ? (
                            <div className="flex gap-8 mb-6 text-base sm:text-xl sm:mb-9">
                              <h3 className="text-gray3">Synonyms</h3>

                              <ul className='flex gap-2 flex-wrap'>

                                {
                                  meaning.synonyms?.map( ( syn: string, index: number ) => (
                                    <li key={ index }>
                                      <Link href="" target="_blank"
                                        className="text-cpurple font-bold text-base hover:underline visited:text-cpurple active:text-cpurple">
                                        { syn }
                                      </Link>
                                    </li>
                                  ) )
                                }
                              </ul>
                            </div>
                          ) : null }
                        </div>
                      ) )
                    }
                  </div>
                </div>
              </section>
            </div>
          ) )
        }

        { inputValue && inputValue.length > 0 ? (
          <>
            <hr className=" mb-6 sm:mb-1.25 border-dark1" />
            <section className="sm:flex sm:items-center sm:gap-4">

              <h4 className="text-gray3 text-base underline mb-2 sm:mb-0">Source</h4>

              <ul>
                {
                  Array.from( new Set( inputValue.flatMap( output => output.sourceUrls ) ) ).map( ( url, j ) => (
                    <li key={ j } className="flex gap-2 sm:gap-4 items-center cursor-pointer">
                      <Link href={ url } target="_blank"
                        className="font-bold text-sm inline-block text-dark2 dark:text-cwhite underline hover:underline ">{ url }</Link>
                      <Image src={ linkIcon } alt="link" className="w-3 h-3 shrink-0 inline-block" width={ 24 } height={ 24 } />
                    </li>
                  ) )
                }
              </ul>
            </section>
          </>
        ) : null
        }


      </main>
    </div>
  );
}
