import { InfoRounded } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface ModalProps {
  items: {
    id: string,
    name: string,
    description: string,
    ids: {
      [key: string]: string
    },
    names: {
      [key: string]: string
    },
    descriptions: {
      [key: string]: string
    },
    votes?: number,
    ratio?:number
  }[]
  handleItemClick: (ids: string, name: string, description: string) => void,
  showSurveyOptions?: boolean
  showVotes?: boolean
}

export function ModalList({ items, handleItemClick, showVotes, showSurveyOptions }: ModalProps) {

  const ratioAnswers = ['strongly_disagree', 'disagree', 'neither', 'agree', 'strongly_agree'];
  const { t } = useTranslation('ecos_survey');

  return (
    <List dense >
      {items.map((item) => (
        <ListItem dense
          secondaryAction={
            <>
              {showVotes && item.votes}
              <IconButton edge="end" aria-label="details" onClick={() => handleItemClick(item.ids[i18next.language], item.names[i18next.language], item.descriptions[i18next.language])}>
                <InfoRounded />
              </IconButton>
            </>
          }
          id={item.id}
          key={item.id}
          divider={true}
        >
          <ListItemText primary={
            <Typography sx={{ fontSize: '.9rem' }}>
              <span style={{ fontWeight: 'bold' }}>{item.ids[i18next.language]}: </span>
              {item.names[i18next.language]}
            </Typography>} />
            {(showSurveyOptions && item.ratio) && <Typography sx={{ fontSize: '.8rem' }}>{(item.ratio != 0) ? t(`survey_options.${ratioAnswers[item.ratio-1]}`) : 'Sem resposta'}</Typography>}
        </ListItem>
      ))}
    </List>
  )
}

