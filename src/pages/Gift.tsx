import { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

export default function Gift() {
  const { isOpen: isOpen1, onOpen: onOpen1, onOpenChange: onOpenChange1 } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });

  const handleYes = () => {
    onOpen1();
  };

  const handleYesOfCourse = () => {
    onOpen2();
  };

  const handleNoHover = () => {
    const randomX = Math.random() * 400 - 200;
    const randomY = Math.random() * 400 - 200;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-pink-200 flex items-center justify-center relative overflow-hidden">
      {/* Red hearts decoration */}
      <div className="absolute top-10 left-10 text-4xl text-red-600">❤️</div>
      <div className="absolute top-20 right-16 text-3xl text-red-600">❤️</div>
      <div className="absolute bottom-20 left-12 text-3xl text-red-600">❤️</div>
      <div className="absolute bottom-10 right-10 text-4xl text-red-600">❤️</div>
      <div className="absolute top-1/4 right-8 text-2xl text-red-600">❤️</div>
      <div className="absolute bottom-1/3 right-1/4 text-2xl text-red-600">❤️</div>
      <div className="absolute top-1/3 left-1/4 text-2xl text-red-600">❤️</div>
      <div className="absolute top-1/2 left-8 text-3xl text-red-600">❤️</div>
      <div className="absolute top-2/3 right-12 text-2xl text-red-600">❤️</div>
      <div className="absolute bottom-1/4 left-1/3 text-2xl text-red-600">❤️</div>
      <div className="absolute top-40 left-1/2 text-2xl text-red-600">❤️</div>

      <div className="text-center relative z-10">
        <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
          Want to go out with me?
        </h1>
        <div className="flex gap-4 justify-center w-full max-w-md mx-auto flex-wrap">
          <Button
            onClick={handleYes}
            color="danger"
            size="lg"
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            onClick={handleYesOfCourse}
            color="danger"
            size="lg"
            className="flex-1"
          >
            Yes, of course
          </Button>
        </div>
        <div className="mt-8 relative h-12">
          <Button
            onMouseEnter={handleNoHover}
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
            color="default"
            className="absolute"
          >
            No 😝😜
          </Button>
        </div>
      </div>

      {/* Congrats Modal */}
      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-pink-600 text-2xl">
            Congrats! 🎉
          </ModalHeader>
          <ModalBody>
            <p className="text-lg text-default-700">
              You picked the right answer <span className="text-2xl">❤️</span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => onOpenChange1()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Amazing Modal for Yes, of course */}
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-pink-600 text-2xl">
            OMG YES! 🎉💕🥳
          </ModalHeader>
          <ModalBody>
            <p className="text-lg text-default-700">
              You picked the BEST answer! Andrei is the best in the world❤️❤️❤️ 💑✨
            </p>
            <div className="text-5xl text-center mb-4 animate-bounce">
              ❤️ 💕 ❤️
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => onOpenChange2()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
