import { Modal, Input } from "web3uikit"

const UpdateNFTModal = (isVisible, onClose) => {
    console.log("entered update modal")

    const closeModal = () => {
        onClose && onClose()
    }
    return (
        <div>
            <Modal
                isVisible={isVisible}
                cancelText="Discard Changes"
                okText="Save Changes"
                onCloseButtonPressed={onClose}
                onOk={onClose}
                onCancel={onClose}
            >
                <div style={{ padding: "20px 0 20px 0" }}>
                    <Input label="Price in ETH" name="Update Price" type="number" />
                </div>
            </Modal>
        </div>
    )
}

export default UpdateNFTModal
