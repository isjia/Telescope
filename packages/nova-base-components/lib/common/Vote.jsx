import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js";
import { Messages } from "meteor/nova:core";
import classNames from 'classnames';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
  }

  upvote(e) {
    e.preventDefault();

    const post = this.props.post;
    const user = this.context.currentUser;

    if(!user){
      Messages.flash("Please log in first");
    } else if (user.hasUpvoted(post)) {
      Actions.call('posts.cancelUpvote', post._id, function(){
        Events.track("post upvote cancelled", {'_id': post._id});
      });        
    } else {
      Actions.call('posts.upvote', post._id, function(){
        Events.track("post upvoted", {'_id': post._id});
      });
    }

  }

  render() {

    const post = this.props.post;
    const user = this.context.currentUser;

    const hasUpvoted = Users.hasUpvoted(user, post);
    const hasDownvoted = Users.hasDownvoted(user, post);
    const actionsClass = classNames(
      "vote", 
      {voted: hasUpvoted || hasDownvoted},
      {upvoted: hasUpvoted},
      {downvoted: hasDownvoted}
    );

    return (
      <div className={actionsClass}>
        <a className="upvote-button" onClick={this.upvote}>
          <Telescope.components.Icon name="upvote" />
          <div className="sr-only">Upvote</div>
          <div className="vote-count">{post.baseScore || 0}</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  post: React.PropTypes.object.isRequired, // the current post
  // currentUser: React.PropTypes.object, // the current user
}

Vote.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = Vote;
export default Vote;