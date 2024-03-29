import Navbar from "../components/Navbar";
import { Divider, Paper, Toolbar, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Footer from "../components/Footer";
import Box from '@mui/material/Box';
import React from 'react';

import { FirebaseService } from "../services/FirebaseService";
import { Framework, FrameworkItem } from "../types/Framework.type";
import { AuthenticationContext, AuthenticationContextType } from "../context/authenticationContext";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EcosystemService from "../services/EcosystemService";
import { QuestionService } from "../services/QuestionService";
import SnackBarComponent from "../components/SnackBarComponent";
import SurveyStepper from "../components/SurveyStepper";
import { Modal } from "../components/Modal";
import { Ecosystem } from "../types/Ecosystem.type";

interface SelectItemsProps {
  id: string,
  title: string,
  items: React.MutableRefObject<FrameworkItem[]>,
  changeItems: (value: FrameworkItem[]) => void,
  order: number
}


export default function EcosSurvey() {

  const [appLoading, setAppLoading] = React.useState<boolean>(true);
  const [copingMechanisms, setCopingMechanisms] = React.useState<Framework | undefined>(undefined);
  const [contextualCharacteristics, setContextualCharacteristics] = React.useState<Framework | undefined>(undefined);
  const [socialHumanFactors, setSocialHumanFactors] = React.useState<Framework | undefined>(undefined);
  const [barriersToImproving, setBarriersToImproving] = React.useState<Framework | undefined>(undefined);
  const [strategies, setStrategies] = React.useState<Framework | undefined>(undefined);

  const [errorModalState, setErrorModalState] = React.useState(false);
  const [errorModalContent, setErrorModalContent] = React.useState({ title: "", description: "" } as { title: string, description: string });

  const [questions, setQuestions] = React.useState<SelectItemsProps[]>([] as SelectItemsProps[]);
  const [feedBackSnackbarState, setFeedBackSnackbarState] = React.useState(false);
  const [feedBackSnackBar, setFeedBackSnackBar] = React.useState({ severity: "success", text: "" } as { severity: "success" | "info" | "warning" | "error", text: string });

  const { t } = useTranslation('ecos_survey');

  const { signed, loading, getUser } = React.useContext(AuthenticationContext) as AuthenticationContextType;

  const navigate = useNavigate();

  const shfRef = React.useRef<FrameworkItem[]>([]);
  const changeShfRef = (items: FrameworkItem[]) => { shfRef.current = items };

  const copingMechanismRef = React.useRef<FrameworkItem[]>([]);
  const changeCopingMechanismRef = (items: FrameworkItem[]) => { copingMechanismRef.current = items };

  const contextualCharacteristicsRef = React.useRef<FrameworkItem[]>([]);
  const changeContextualCharacteristicsRef = (items: FrameworkItem[]) => { contextualCharacteristicsRef.current = items };

  const barriersToImprovingRef = React.useRef<FrameworkItem[]>([]);
  const changeBarriersToImprovingRef = (items: FrameworkItem[]) => { barriersToImprovingRef.current = items };

  const strategiesRef = React.useRef<FrameworkItem[]>([]);
  const changeStrategiesRef = (items: FrameworkItem[]) => { strategiesRef.current = items };

  const ecosId = useParams().ecosId;

  const [ecos, setEcos] = React.useState<Ecosystem | undefined>(undefined);

  const ErrorModal = () => {
    const handleClose = () => {
      setErrorModalState(false);
      navigate('/');
    }

    return (
      <Modal.Root state={errorModalState} id={errorModalContent.title} handleClose={handleClose} title={errorModalContent.title}>
        <Modal.Text>
          <Typography sx={{ textAlign: 'justify', marginBottom: '1rem', textIndent: '1rem' }}>
            {errorModalContent.description}
          </Typography>
        </Modal.Text>
        <Divider />
        <Modal.Actions handleClose={handleClose} />
      </Modal.Root>
    );
  }

  React.useEffect(() => {
    if (loading) return;

    if (!signed) navigate(`/sign-in?redirect=${window.location.pathname}`);

    const getEcosData = async () => {
      if(ecos) return ecos;

      if (!ecosId) return;

      const ecosData = await EcosystemService.getEcosystem(ecosId);
      setEcos(ecosData);

      if (ecosData.status !== "waiting-for-answers") {
        throw new Error("Ecosystem is not waiting for answers");
      }
      return ecosData;
    }

    const handleFrameworkItemsRef = (frameworkItem: Framework) => {
      return frameworkItem.items.map((item) => {
        return {
          id: item.id,
          ids: item.ids,
          names: item.names,
          descriptions: item.descriptions,
          ratio: 0,
        } as FrameworkItem;
      });
    }

    const handleFrameworkData = (data: Framework[]) => {
      const socialHumanFactorsLocal = data.filter((item) => item.id === "social-human-factors")[0];
      const copingMechanismsLocal = data.filter((item) => item.id === "coping-mechanisms")[0];
      const contextualCharacteristicsLocal = data.filter((item) => item.id === "contextual-characteristics")[0];
      const barriersToImprovingLocal = data.filter((item) => item.id === "barriers-to-improving")[0];
      const strategiesLocal = data.filter((item) => item.id === "strategies")[0];

      changeShfRef(handleFrameworkItemsRef(socialHumanFactorsLocal));
      changeCopingMechanismRef(handleFrameworkItemsRef(copingMechanismsLocal));
      changeContextualCharacteristicsRef(handleFrameworkItemsRef(contextualCharacteristicsLocal));
      changeBarriersToImprovingRef(handleFrameworkItemsRef(barriersToImprovingLocal));
      changeStrategiesRef(handleFrameworkItemsRef(strategiesLocal));

      setCopingMechanisms(copingMechanismsLocal);
      setContextualCharacteristics(contextualCharacteristicsLocal);
      setSocialHumanFactors(socialHumanFactorsLocal);
      setBarriersToImproving(barriersToImprovingLocal);
      setStrategies(strategiesLocal);

      if (questions.length === 0) {
        setQuestions([
          {
            id: "social-human-factors",
            title: 'fsh_affirmative',
            items: shfRef,
            changeItems: changeShfRef,
            order: 1
          },
          {
            id: "contextual-characteristics",
            title: 'cc_affirmative',
            items: contextualCharacteristicsRef,
            changeItems: changeContextualCharacteristicsRef,
            order: 2
          },
          {
            id: "barriers-to-improving",
            title: 'barriers_affirmative',
            items: barriersToImprovingRef,
            changeItems: changeBarriersToImprovingRef,
            order: 3
          },
          {
            id: "strategies",
            title: 'strategies_affirmative',
            items: strategiesRef,
            changeItems: changeStrategiesRef,
            order: 4
          },
          {
            id: "coping-mechanisms",
            title: 'coping_mec_affirmative',
            items: copingMechanismRef,
            changeItems: changeCopingMechanismRef,
            order: 5
          }
        ]);
      }

    }

    getEcosData().then((ecosData) => {
      if (!ecosData) return;

      QuestionService.getAnswersByUserId(getUser().uid)
        .then((answers) => {
          if (answers.find((answer) => answer.ecossystem_id == ecosId)?.round == ecosData.current_round) {
            // setErrorModalContent({ title: t('errors.title'), description: t('errors.already_answered') });
            // setErrorModalState(true);
            return;
          }
        });

      const localStorageData = localStorage.getItem('frameworkData');

      if (localStorageData) {
        handleFrameworkData(JSON.parse(localStorageData));
        return;
      }

      FirebaseService.getFrameworkData((data: Framework[]) => {
        localStorage.setItem('frameworkData', JSON.stringify(data));
        handleFrameworkData(data);
      });
    }).catch(() => {
      setErrorModalContent({ title: t('errors.title'), description: t('errors.not_accept_answers') });
      setErrorModalState(true);
      return;
    });

    setAppLoading(false);
  }, [setStrategies, setCopingMechanisms, setContextualCharacteristics, setSocialHumanFactors, setBarriersToImproving, questions, loading, signed, navigate, t, ecosId, getUser, ecos]);

  return (
    <>
      <ErrorModal />
      <SnackBarComponent snackBarState={feedBackSnackbarState} setSnackBarState={setFeedBackSnackbarState} severity={feedBackSnackBar.severity} text={feedBackSnackBar.text} />
      <Box >
        <Navbar />
        <Toolbar />
        <Container sx={{ minHeight: '100vh', background: '#f5f5f5' }} component={Paper} elevation={3} style={{ paddingTop: '1%' }} maxWidth={false}>

          {!appLoading && <Typography variant='h4' sx={{ textAlign: 'center', marginBottom: '1rem' }}>{ecos?.organization_name??''}</Typography>}

          {(!appLoading && ecos) && <SurveyStepper
            stepsVote={questions}
            frameworkItems={{
              socialHumanFactors,
              contextualCharacteristics,
              barriersToImproving,
              strategies,
              copingMechanisms,
              setSocialHumanFactors,
              setContextualCharacteristics,
              setBarriersToImproving,
              setStrategies,
              setCopingMechanisms
            }}
            ecos={ecos}
            user_id={getUser().uid}
            user_email={getUser().email}
            setFeedBackSnackBar={setFeedBackSnackBar}
            setFeedBackSnackbarState={setFeedBackSnackbarState}
            user_name={getUser().displayName??getUser().email}
          />}
        </Container>
        <Footer />
      </Box>
    </>
  )
}