import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { Credentials, StringTranslations } from '@crowdin/crowdin-api-client'
import { LangType } from '@pancakeswap-libs/uikit'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import AddLiquidity from './AddLiquidity'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Swap from './Swap'
import Home from './Home'
import Farms from './Farms/index.js'
import { RedirectPathToSwapOnly } from './Swap/redirects'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'

import Menu from '../components/Menu'
import useGetDocumentTitlePrice from '../hooks/useGetDocumentTitlePrice'
import Header from 'components/Header/Header'
import Work_main from 'components/WorkMain/Work_main'
import About_main from 'components/AboutMain/About_main'
import Faq_main from 'components/FaqMain/Faq_main'
import Pool_main from 'components/PoolMain/Pool_main'
import Overview_main from 'components/OverviewMain/Overview_main'
import Footer from 'components/Footer/Footer'
import Token_main from 'components/TokenMain/Token_main'
import Nft from 'components/Nft/Nft'
import Nftopen from 'components/Nftopen/Nftopen'
import Lpfarming from 'components/Lpfarming/Lpfarming'
import Homee from 'components/Homee/Homee'
import Swaapp from 'components/Swaapp/Swaapp'
import AllPool from 'components/PoolMain/AllPool'
import DetailPage from 'components/PoolMain/DetailPage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px 16px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: bottom 24px center;
  background-size: 90%;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/arch-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg'),
      url('/images/left-pancake.svg'), url('/images/right-pancake.svg');
    background-repeat: no-repeat;
    background-position: center 420px, 10% 230px, 90% 230px;
    background-size: contain, 266px, 266px;
    min-height: 90vh;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const CACHE_KEY = 'pancakeSwapLanguage'

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])
  const [dataProps, setDataProps] = useState([])
  const apiKey = `${process.env.REACT_APP_CROWDIN_APIKEY}`
  const projectId = parseInt(`${process.env.REACT_APP_CROWDIN_PROJECTID}`)
  const fileId = 6

  const credentials: Credentials = {
    token: apiKey,
  }

  const stringTranslationsApi = new StringTranslations(credentials)

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem(CACHE_KEY)
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  const fetchTranslationsForSelectedLanguage = async () => {
    stringTranslationsApi
      .listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 200)
      .then((translationApiResponse) => {
        if (translationApiResponse.data.length < 1) {
          setTranslations(['error'])
        } else {
          setTranslations(translationApiResponse.data)
        }
      })
      .then(() => setTranslatedLanguage(selectedLanguage))
      .catch((error) => {
        setTranslations(['error'])
        console.error(error)
      })
  }

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  const handleLanguageSelect = (langObject: LangType) => {
    setSelectedLanguage(langObject)
    localStorage.setItem(CACHE_KEY, langObject.code)
  }
  useGetDocumentTitlePrice()
  console.log('dataProps', dataProps)

  useGetDocumentTitlePrice()
  const [isColor, setIsColor] = useState('')
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          <LanguageContext.Provider
            value={{
              selectedLanguage,
              setSelectedLanguage: handleLanguageSelect,
              translatedLanguage,
              setTranslatedLanguage,
            }}
          >
            {' '}
            <Web3ReactManager>
              <Switch>
                <TranslationsContext.Provider value={{ translations, setTranslations }}>
                  <Header />
                  <Menu>
                    <BodyWrapper>
                      {/* <Popups /> */}
                      <Route exact strict path="/swap" component={Swap} />
                      <Route exact strict path="/find" component={PoolFinder} />
                      <Route exact strict path="/pool" component={Pool} />
                      <Route exact path="/add" component={AddLiquidity} />
                      <Route exact path="/add/:currencyIdA" component={AddLiquidity} />
                      <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                      <Route exact path="/home" component={Home} />
                      <Route exact strict path="/farms" component={Farms} />

                      {/* Redirection: These old routes are still used in the code base */}
                      {/* <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} /> */}
                      <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                      <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                      <Route exact strict path="/" component={Home} />
                      <Route exact path="/nft" component={Nft} />
                      <Route exact path="/nftop" component={Nftopen} />
                      <Route exact path="/lpfar" component={Lpfarming} />
                      <Route exact path="/sawp" component={Homee} />
                      <Route exact path="/wonder" component={Swaapp} />
                      <Route path="/Work_main" component={Work_main} />
                      <Route path="/About_main" component={About_main} />

                      {/* <Route path="/Faq_main" component={Faq_main} /> */}
                      <Route path="/Overview_main" component={Overview_main} />
                      {/* <Route path="/Pool_main" component={Pool_main} /> */}
                      <Route path="/Token_main" component={Token_main} />
                      <Route path="/AllPool">
                        <AllPool setDataProps={setDataProps} />
                      </Route>
                      <Route path="/DetailPage">
                        <DetailPage dataProps={dataProps} />
                      </Route>
                      {/* <Route component={RedirectPathToSwapOnly} /> */}
                      <Marginer />
                    </BodyWrapper>
                    <Footer />
                  </Menu>
                </TranslationsContext.Provider>
              </Switch>
            </Web3ReactManager>
          </LanguageContext.Provider>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
