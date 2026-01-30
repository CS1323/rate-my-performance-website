import DrewImage from '../../assets/images/drew1.png';

export function InitialPost() {
  return (
    <section className="initial-post">
      <div className="initial-post-title">Thinking About Hooking Up With Drew Dumontier?</div>

      <div className="initial-post-image">
        <img src={DrewImage} />
      </div>

      <div className="initial-post-comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quo consequuntur esse! Dolorem consectetur qui quia ab enim dolorum eveniet recusandae pariatur laborum impedit! Excepturi veritatis vel voluptas. Odit, eligendi!
      </div>
    </section>
  );
}