import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormGroup from '@material-ui/core/FormGroup'
import Button from '@material-ui/core/Button'
import Checker from './Checker'


const svgStyle = {
    height: 64 - 8,
    width: 64 - 8,
    pointerEvents: 'none'
}

const SuperUserDialog = observer(function SuperUserDialog(props) {

    const { settings } = useStore()

    if (!settings.openSuperUserDialog) {
        return null;
    }

    const handleClose = () => {
        settings.setOpenSuperUserDialog(false)
    }

    const handleClick = ({ side, isKing }) => {
        const point = settings.selected[0]
        settings.setSquare(point, side, isKing)
        settings.clearSelected()
        settings.setOpenSuperUserDialog(false)
    }

    const handleCancel = () => {
        settings.clearSelected()
        settings.setOpenSuperUserDialog(false)
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="ssuper-user-dialog" open={settings.openSuperUserDialog}>
            <DialogTitle id="simple-dialog-title">Select an option for this square</DialogTitle>
            <DialogContent>
                <FormGroup row>
                    <Button onClick={() => { handleClick({ side: 2, isKing: false }) }} startIcon={<Checker player={2} isKing={false} svgStyle={svgStyle} />} />
                    <Button onClick={() => { handleClick({ side: 2, isKing: true }) }} startIcon={<Checker player={2} isKing={true} svgStyle={svgStyle} />} />
                </FormGroup>
                <FormGroup row>
                    <Button onClick={() => { handleClick({ side: 1, isKing: false }) }} startIcon={<Checker player={1} isKing={false} svgStyle={svgStyle} />} />
                    <Button onClick={() => { handleClick({ side: 1, isKing: true }) }} startIcon={<Checker player={1} isKing={true} svgStyle={svgStyle} />} />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
})
export default SuperUserDialog
