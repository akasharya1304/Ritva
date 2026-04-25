import Header from "@/components/comman/Header"
import { BiAward } from "react-icons/bi"
import { BsClock } from "react-icons/bs"
import { FaUser } from "react-icons/fa"
import { FiTarget } from "react-icons/fi"

const Profile = () => {

  return (
    <div className="min-h-screen pb-24">
        <Header title="प्रोफ़ाइल" subtitle="Your Yoga Journey" />

        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-gold flex items-center justify-center mb-4">
            <FaUser className="w-12 h-12 text-primary-foreground" />
          </div>
          <p className="font-serif text-muted-foreground italic">
            {"Namaste, Yogi"}
          </p>
        </div>

        <div className="ornament-line w-full" />

        <section className="space-y-4">
          <h2 className="font-display text-xl flex items-center gap-2">
            <FaUser className="w-5 h-5 text-primary" />
            Personal Information
          </h2>
        </section>

        <div className="grid grid-cols-3 gap-3 pt-6">
          <div className="sanskrit-border p-4 rounded-xl text-center">
            <BiAward className="w-6 h-6 mx-auto text-gold mb-2" />
            <p className="font-display text-2xl text-foreground">0</p>
            <p className="text-xs text-muted-foreground font-serif">Days Streak</p>
          </div>
          <div className="sanskrit-border p-4 rounded-xl text-center">
            <BsClock className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">0</p>
            <p className="text-xs text-muted-foreground font-serif">Minutes</p>
          </div>
          <div className="sanskrit-border p-4 rounded-xl text-center">
            <FiTarget className="w-6 h-6 mx-auto text-sage mb-2" />
            <p className="font-display text-2xl text-foreground">0</p>
            <p className="text-xs text-muted-foreground font-serif">Poses Done</p>
          </div>
        </div>
    </div>
  )
}

export default Profile