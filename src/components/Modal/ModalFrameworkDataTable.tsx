import { InfoRounded } from "@mui/icons-material";
import { IconButton, Radio, TextField, Tooltip } from "@mui/material";
import i18next from "i18next";
import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRenderEditCellParams } from '@mui/x-data-grid';
import { useTranslation } from "react-i18next";


interface ModalProps {
  items: React.MutableRefObject<ItemType[]>,
  changeItems: (value: ItemType[]) => void,
  showVotes?: boolean
}

interface ItemType {
  id: string,
  ids: {
    [key: string]: string
  },
  names: {
    [key: string]: string
  },
  descriptions: {
    [key: string]: string
  },
  ratio: number,
  votes?: number
}


export function ModalFrameworkDataTable({ items, changeItems }: ModalProps) {
  const [listItems, setListItems] = React.useState(items.current);

  const { t } = useTranslation('ecos_survey');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newItems = [...listItems];
    const itemIndex = newItems.findIndex((item) => item.ids[i18next.language] === id);
    newItems[itemIndex].ratio = parseInt(event.target.value);
    setListItems(newItems);
    changeItems(newItems);
  }


  const createRadioButton = (value: number, params: GridRenderEditCellParams<ItemType, number>) => (
    <Radio
      checked={listItems.find((item) => item.ids[i18next.language] == params.id)?.ratio == value}
      name="item-ratio"
      onChange={(event) => handleRadioChange(event, params.id as string)}
      value={value}
    />
  )

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, sortable: false, resizable: false },
    {
      field: 'name', headerName: t('item_name'), width: 350, sortable: false, resizable: false, renderCell: (params: GridRenderEditCellParams<ItemType, number>) => (
        <TextField
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <Tooltip arrow title={<p style={{fontSize: '1rem'}}>{listItems.find((item)=>item.ids[i18next.language] === params.id)?.descriptions[i18next.language]}</p>  } >
                <IconButton>
                  <InfoRounded sx={{ color: 'primary.main', cursor: 'pointer' }} fontSize="small" />
                </IconButton>
              </Tooltip>)
          }}
          multiline
          value={` ${listItems.find((item) => item.ids[i18next.language] === params.id)?.names[i18next.language]} `
          }
          variant="standard"
          sx={{ width: '100%', background: 'white' }}
        />
      )
    },
    {
      field: 'fully-disagree', headerName: t('survey_options.strongly_disagree'), width: 90, sortable: false, resizable: false, renderCell: (params: GridRenderCellParams<ItemType, number>) => createRadioButton(1, params)
    },
    {
      field: 'disagree', headerName: t('survey_options.disagree'), width: 90, sortable: false, resizable: false, renderCell: (params: GridRenderCellParams<ItemType, number>) => createRadioButton(2, params)
    },
    {
      field: 'neutral', headerName: t('survey_options.neither'), width: 90, sortable: false, resizable: false, renderCell: (params: GridRenderCellParams<ItemType, number>) => createRadioButton(3, params)
    },
    {
      field: 'agree', headerName: t('survey_options.agree'), width: 90, sortable: false, resizable: false, renderCell: (params: GridRenderCellParams<ItemType, number>) => createRadioButton(4, params)
    },
    {
      field: 'fully-agree', headerName: t('survey_options.strongly_agree'), width: 100, sortable: false, resizable: false, renderCell: (params: GridRenderCellParams<ItemType, number>) => createRadioButton(5, params)
    }
  ]

  const rows = listItems.map((item) => {
    return {
      id: item.ids[i18next.language],
      name: item.names[i18next.language],
    }
  })

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooterPagination
        hideFooter
        columnHeaderHeight={80}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: "clip",
            whiteSpace: "break-spaces",
            lineHeight: '1.2rem'
        }
        }}
      />
    </>
  )
}
